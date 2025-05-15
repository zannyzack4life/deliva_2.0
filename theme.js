  // Event listener for theme toggling
  const themeToggler = document.querySelector(".theme-toggler");

  // Retrieve theme from localStorage
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme) {
      document.body.classList.add(currentTheme);
      if (currentTheme === "dark-theme-variables") {
          themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
          themeToggler.querySelector('span:nth-child(2)').classList.add('active');
      }
  } else {
      themeToggler.querySelector('span:nth-child(1)').classList.add('active');
  }

  // Change theme
  themeToggler.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme-variables');

      if (document.body.classList.contains('dark-theme-variables')) {
          localStorage.setItem("theme", "dark-theme-variables");
          themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
          themeToggler.querySelector('span:nth-child(2)').classList.add('active');
      } else {
          localStorage.setItem("theme", "light-theme-variables");
          themeToggler.querySelector('span:nth-child(1)').classList.add('active');
          themeToggler.querySelector('span:nth-child(2)').classList.remove('active');
      }
  });


