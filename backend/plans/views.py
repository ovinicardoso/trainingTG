from django.shortcuts import render
import ollama
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from sentence_transformers import SentenceTransformer
from pgvector.django import L2Distance
from .models import DocumentChunk

try:
    EMBEDDING_MODEL, OLLAMA_CLIENT = SentenceTransformer('all-MiniLM-L6-v2'), ollama.Client()
    OLLAMA_CLIENT.list()
    print("Modelos de IA carregados com sucesso.")
except Exception as e:
    print(f"AVISO: Falha ao carregar modelos ou conectar com Ollama. Erro: {e}")
    EMBEDDING_MODEL, OLLAMA_CLIENT = None, None

class FitnessQueryView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        if not all([EMBEDDING_MODEL, OLLAMA_CLIENT]): return Response({"error": "Sistema de IA não inicializado."}, status=503)
        question = request.data.get('question')
        if not question: return Response({"error": "A 'question' é obrigatória."}, status=400)
        relevant_chunks = self._retrieve_relevant_chunks(question)
        context = "\\n\\n".join(chunk.content for chunk in relevant_chunks)
        answer = self._generate_answer_ollama(question, context)
        return Response({"answer": answer})

    def _retrieve_relevant_chunks(self, question, top_k=3):
        question_embedding = EMBEDDING_MODEL.encode(question)
        return DocumentChunk.objects.order_by(L2Distance('embedding', question_embedding))[:top_k]

    def _generate_answer_ollama(self, question, context):
        system_prompt = ("Você é 'Training', um assistente de fitness com IA. "
                         "Sua função é fornecer respostas precisas e científicas com base no contexto fornecido. "
                         "Responda em português. Nunca invente informações. Se o contexto não for suficiente, "
                         "diga que não encontrou informações sobre o assunto nos artigos disponíveis.")
        user_prompt = f"Com base no contexto abaixo, responda à pergunta.\n\nContexto:\n{context}\n\nPergunta:\n{question}"
        messages = [{'role': 'system', 'content': system_prompt}, {'role': 'user', 'content': user_prompt}]
        try:
            response = OLLAMA_CLIENT.chat(model='llama3.2', messages=messages)
            return response['message']['content'].strip()
        except Exception as e:
            return "Desculpe, ocorreu um erro ao se comunicar com o modelo de IA."