
# Training - Django Backend Setup

Este guia explica como configurar o backend Django para a aplicação Training.

## Pré-requisitos

- Python 3.8+
- PostgreSQL
- pip

## Passos para configuração

1. **Criar ambiente virtual**

```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

2. **Instalar dependências**

```bash
pip install django djangorestframework djangorestframework-simplejwt python-dotenv psycopg2-binary django-cors-headers
```

3. **Criar projeto Django**

```bash
django-admin startproject config .
```

4. **Criar apps**

```bash
python manage.py startapp users
python manage.py startapp plans
```

5. **Configurar banco de dados PostgreSQL**

Edite `config/settings.py` para incluir:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'training_db',
        'USER': 'postgres',
        'PASSWORD': 'admin',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

6. **Configurar CORS**

Adicione em `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    'rest_framework',
    'users',
    'plans',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... outros middlewares
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # URL do frontend Vite
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

7. **Criar modelos**

Em `users/models.py`:

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ('male', 'Masculino'),
        ('female', 'Feminino'),
        ('other', 'Outro'),
    ]

    GOAL_CHOICES = [
        ('lose', 'Perder Peso'),
        ('maintain', 'Manter Peso'),
        ('gain', 'Ganhar Peso'),
    ]

    name = models.CharField(max_length=100)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='male')
    fitness_goal = models.CharField(max_length=10, choices=GOAL_CHOICES, default='lose')
    workout_frequency = models.IntegerField(default=3)
```

8. **Criar serializers**

Em `users/serializers.py`:

```python
from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'weight', 'height', 'age', 'gender', 'fitness_goal', 'workout_frequency']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
```

9. **Criar views**

Em `users/views.py`:

```python
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from .models import CustomUser

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
```

10. **Configurar URLs**

Em `users/urls.py`:

```python
from django.urls import path
from .views import RegisterView, ProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
```

Em `config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/generate-plan/', include('plans.urls')),
]
```

11. **Executar migrações**

```bash
python manage.py makemigrations
python manage.py migrate
```

12. **Criar superusuário**

```bash
python manage.py createsuperuser
```

13. **Iniciar servidor**

```bash
python manage.py runserver
```

## Endpoints API

O backend Django terá os seguintes endpoints:

- `POST /api/auth/register/` - Registrar novo usuário
- `POST /api/auth/login/` - Login para obter token JWT
- `GET /api/auth/profile/` - Obter perfil do usuário
- `PATCH /api/auth/profile/` - Atualizar perfil do usuário
- `POST /api/generate-plan/workout/` - Gerar plano de treino
- `POST /api/generate-plan/diet/` - Gerar plano alimentar
