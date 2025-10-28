// Admin parametres page JS
// Handle logo preview and color swatches when available
document.addEventListener('DOMContentLoaded', function() {
    const logoInput = document.getElementById('site-logo');
    const logoPreviewImg = document.querySelector('#logo-preview img');
    if (logoInput && logoPreviewImg) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            logoPreviewImg.src = url;
        });
    }

    const pairs = [
        ['color-primary','swatch-primary'],
        ['color-secondary','swatch-secondary'],
        ['color-accent','swatch-accent']
    ];
    pairs.forEach(([inputId, swatchId]) => {
        const input = document.getElementById(inputId);
        const sw = document.getElementById(swatchId);
        if (input && sw) {
            sw.style.backgroundColor = input.value;
            input.addEventListener('input', () => sw.style.backgroundColor = input.value);
        }
    });

    const form = document.getElementById('site-settings-form');
    if (form) {
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            // TODO: send via fetch to backend
            alert('Paramètres sauvegardés (simulation)');
        });
    }
});
