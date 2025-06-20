from django.db import models
from pgvector.django import VectorField

class DocumentChunk(models.Model):
    source = models.CharField(max_length=255, help_text="Nome do documento de origem")
    content = models.TextField(help_text="O pedaço de texto do documento")
    embedding = VectorField(dimensions=384)  # Dimensão para o modelo 'all-MiniLM-L6-v2'

    def __str__(self):
        return f"Chunk from {self.source}"