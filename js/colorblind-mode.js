document.addEventListener('DOMContentLoaded', function () {
  const colorblindBtn = document.getElementById('colorblindToggle');
  const COLORBLIND_KEY = 'colorblindMode';

  // Restore colorblind mode from localStorage
  if (localStorage.getItem(COLORBLIND_KEY) === 'on') {
    document.body.classList.add('colorblind-mode');
    colorblindBtn.classList.add('active');
  }

  colorblindBtn.addEventListener('click', function () {
    const isActive = document.body.classList.toggle('colorblind-mode');
    colorblindBtn.classList.toggle('active', isActive);

    // Save preference
    localStorage.setItem(COLORBLIND_KEY, isActive ? 'on' : 'off');
  });
});
