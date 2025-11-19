from django.db import models
from usuarios.models import Usuario
from inventario.models import Medicamento

class Pedido(models.Model):
    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("procesado", "Procesado"),
        ("entregado", "Entregado"),
        ("cancelado", "Cancelado"),
    ]

    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="pedidos")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="pendiente")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Pedido #{self.cliente} - {self.cliente.username}"

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    medicamento = models.ForeignKey(Medicamento, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # Calcular subtotal automático
        if self.medicamento:
            self.subtotal = self.medicamento.precio_venta * self.cantidad
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.medicamento.nombre} x {self.cantidad}"
