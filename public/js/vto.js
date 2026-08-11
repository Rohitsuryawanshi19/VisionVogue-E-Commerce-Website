// ===================== Virtual Try-On Simulator =====================
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('vtoDropzone');
  const fileInput = document.getElementById('vtoFileInput');
  const step1 = document.getElementById('vtoStep1');
  const step2 = document.getElementById('vtoStep2');
  const step3 = document.getElementById('vtoStep3');
  const scanImg = document.getElementById('vtoScanImg');
  const resultShape = document.getElementById('vtoResultShape');
  const resultChips = document.getElementById('vtoResultChips');

  if (!dropzone) return;

  const faceShapes = {
    'Oval': ['Rectangle', 'Aviator', 'Square'],
    'Round': ['Square', 'Rectangle', 'Browline'],
    'Square': ['Round', 'Cat Eye', 'Aviator'],
    'Heart': ['Cat Eye', 'Round', 'Rimless']
  };

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      scanImg.src = e.target.result;
      step1.style.display = 'none';
      step2.style.display = 'block';
      step3.style.display = 'none';

      setTimeout(() => {
        const shapes = Object.keys(faceShapes);
        const chosen = shapes[Math.floor(Math.random() * shapes.length)];
        step2.style.display = 'none';
        step3.style.display = 'block';
        resultShape.textContent = chosen;
        resultChips.innerHTML = faceShapes[chosen]
          .map(s => `<span class="recommend-chip">${s}</span>`).join('');
      }, 3000);
    };
    reader.readAsDataURL(file);
  }

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
  });

  document.getElementById('vtoRestart')?.addEventListener('click', () => {
    step1.style.display = 'block';
    step2.style.display = 'none';
    step3.style.display = 'none';
    fileInput.value = '';
  });
});
