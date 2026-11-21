package LearnPatternBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres.")
        String nombre,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "El correo debe tener un formato valido.")
        @Size(max = 255, message = "El correo no puede superar 255 caracteres.")
        String correo,

        @NotBlank(message = "La contrasena es obligatoria.")
        @Size(min = 6, max = 100, message = "La contrasena debe tener al menos 6 caracteres.")
        String contrasena
) {
}