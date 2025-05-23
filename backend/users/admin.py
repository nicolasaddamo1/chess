from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'elo', 'score', 'is_active')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'elo')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-elo',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('elo', 'score')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Adicional', {
            'fields': ('first_name', 'last_name', 'email', 'elo', 'score'),
        }),
    )