from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #novo

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'name', 'weight', 'height', 'age', 'gender', 'fitness_goal', 'workout_frequency']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')  # Remove a senha do dicionário
        user = CustomUser(**validated_data)
        user.set_password(password)  # Cria o hash da senha
        user.save()
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): #classe nova
    def validate(self, attrs):
        # Substitui 'username' por 'email'
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }
        user = CustomUser.objects.get(email=credentials['email'])
        if user and user.check_password(credentials['password']):
            return super().validate(credentials)
        raise serializers.ValidationError("Credenciais inválidas")

"""class UserSerializer(serializers.ModelSerializer):
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
        return user"""