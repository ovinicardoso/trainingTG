
from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'name', 'weight', 'height', 'age', 'gender', 'fitness_goal', 'workout_frequency']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')  # Remove the password from the dictionary
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"
    def validate(self, attrs):
        # The default JWT authentication uses username, but we want to use email
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
                if user.check_password(password):
                    # Set username attribute to make the parent class work
                    attrs['username'] = user.username
                    return super().validate(attrs)
            except CustomUser.DoesNotExist:
                pass
                
        raise serializers.ValidationError("Invalid email or password")
        
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['name'] = user.name
        
        return token
