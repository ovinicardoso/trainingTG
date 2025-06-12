import os
from django.conf import settings
from langchain_community.document_loaders import PDFPlumberLoader

def extrair_texto_de_pdf(nome_do_arquivo: str) -> str:
    """
    Carrega um arquivo PDF de uma pasta local e extrai seu conteúdo de texto.
    
    Args:
        nome_do_arquivo: O nome do arquivo PDF (ex: 'documento1.pdf').

    Returns:
        O texto completo extraído do documento.
    """
    # Constrói o caminho completo para o arquivo PDF
    caminho_do_arquivo = os.path.join(settings.BASE_DIR, 'pdfs', nome_do_arquivo)
    
    if not os.path.exists(caminho_do_arquivo):
        raise FileNotFoundError(f"O arquivo {caminho_do_arquivo} não foi encontrado.")

    # Usa o PDFPlumberLoader do LangChain para carregar e extrair o texto
    loader = PDFPlumberLoader(caminho_do_arquivo)
    documentos = loader.load()

    # Concatena o texto de todas as páginas
    texto_completo = "".join([doc.page_content for doc in documentos])
    
    return texto_completo

def extrair_texto_de_todos_os_pdfs() -> dict[str, str]:
    """
    Processa todos os arquivos .pdf na pasta 'pdfs' e retorna seus textos.

    Returns:
        Um dicionário onde a chave é o nome do arquivo e o valor é o texto extraído.
    """
    pasta_pdfs = os.path.join(settings.BASE_DIR, 'pdfs')
    resultados = {}

    if not os.path.isdir(pasta_pdfs):
        print(f"A pasta {pasta_pdfs} não existe.")
        return resultados

    for nome_do_arquivo in os.listdir(pasta_pdfs):
        if nome_do_arquivo.lower().endswith(".pdf"):
            print(f"Processando arquivo: {nome_do_arquivo}...")
            try:
                texto = extrair_texto_de_pdf(nome_do_arquivo)
                resultados[nome_do_arquivo] = texto
                print(f"Finalizado: {nome_do_arquivo}")
            except Exception as e:
                print(f"Erro ao processar o arquivo {nome_do_arquivo}: {e}")
    
    return resultados