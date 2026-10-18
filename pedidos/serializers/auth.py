from django.contrib.auth.models import User
from rest_framework import serializers
class CadastroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # write_only garante que a senha nunca seja lida de volta pela API

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        # O 'create_user' é crucial aqui! Ele aplica a criptografia (hash) na senha.
        # Se usássemos apenas .create(), a senha ficaria exposta no banco de dados.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user