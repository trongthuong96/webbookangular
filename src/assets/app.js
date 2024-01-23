function showFullTabContent() {
    const productDetailInfo = document.querySelector('.story-detail__top--desc')
    if (productDetailInfo) {
        productDetailInfo.classList.add('show-full')

        const productDetailInfoMore = document.querySelector('.info-more')
        if (productDetailInfoMore) {
            const more = productDetailInfoMore.querySelector('.info-more--more')
            more && more.classList.remove('active')

            const collapse = productDetailInfoMore.querySelector('.info-more--collapse')
            collapse && collapse.classList.add('active')
        }
    }
}

function collapseDescription() {
    const productDetailInfoTabContent = document.querySelector('.story-detail__top--desc')
    if (productDetailInfoTabContent) {
        productDetailInfoTabContent.classList.remove('show-full')

        const productDetailInfoMore = document.querySelector('.info-more')
        if (productDetailInfoMore) {
            const more = productDetailInfoMore.querySelector('.info-more--more')
            more && more.classList.add('active')

            const collapse = productDetailInfoMore.querySelector('.info-more--collapse')
            collapse && collapse.classList.remove('active')
        }
    }
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('info-more--more') || e.target.closest('.info-more--more')) {
        showFullTabContent()
    }

    if (e.target.classList.contains('info-more--collapse') || e.target.closest('.info-more--collapse')) {
        collapseDescription()
    }
})


document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
      var navbarToggler = document.querySelector(".navbar-toggler");
      var navbarCollapse = document.querySelector(".navbar-collapse");

      if (navbarToggler.contains(event.target) || navbarCollapse.contains(event.target)) {
        // Click diễn ra trong Navbar, không làm gì cả
      } else {
        // Click diễn ra bên ngoài Navbar, đóng Navbar nếu đang mở
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click();
        }
      }
    });
  });

  // Lấy button và input
const passwordInput = document.getElementById('registerPassword'); 
const showBtn = document.querySelector('.show-password-btn');
if (showBtn) {
    // Xử lý click để toggle
    showBtn.addEventListener('click', function() {
    // Đổi type password/text
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'; 
    
    // Đổi icon eye <i class="fa-regular fa-eye-slash"></i>
    eyeIcon(this)
    })
}

const passwordConfirmInput = document.getElementById('registerPasswordConfirm'); 
const showConfirmBtn = document.querySelector('.show-passwordConfirm-btn');

if (showConfirmBtn) {
    // Xử lý click để toggle
    showConfirmBtn.addEventListener('click', function() {
        // Đổi type password/text
        passwordConfirmInput.type = passwordConfirmInput.type === 'password' ? 'text' : 'password'; 
        
        // Đổi icon eye <i class="fa-regular fa-eye-slash"></i>
        eyeIcon(this)
    })
}

const passwordLoginInput = document.getElementById('loginPassword'); 
const showLoginBtn = document.querySelector('.show-password-login-btn');

if (showLoginBtn) {
    // Xử lý click để toggle
    showLoginBtn.addEventListener('click', function() {
        // Đổi type password/text
        passwordLoginInput.type = passwordLoginInput.type === 'password' ? 'text' : 'password'; 
        
        // Đổi icon eye <i class="fa-regular fa-eye-slash"></i>
        eyeIcon(this)
    })
}

function eyeIcon(btn) {
// Đổi icon eye <i class="fa-regular fa-eye-slash"></i>
const eyeIcon = btn.querySelector('i');
    // Đổi icon eye
    if (eyeIcon.classList.contains('fa-eye')) {
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    
    } else {
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}