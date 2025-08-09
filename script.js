// script.js
// Navigation Toggle
document.getElementById('navToggle').addEventListener('click', function() {
    document.getElementById('navMenu').classList.toggle('active');
});

// Loan Amount Slider
const loanAmount = document.getElementById('loanAmount');
const loanAmountValue = document.getElementById('loanAmountValue');
const registrationFee = document.getElementById('registrationFee');

function updateLoanValues() {
    const value = parseInt(loanAmount.value);
    loanAmountValue.textContent = value.toLocaleString('pt-MZ') + ' MZN';
    
    // Calcular taxa de inscrição com as novas faixas
    let fee = 0;
    
    if (value >= 5000 && value <= 8999) {
        fee = 514;
    } else if (value >= 9000 && value <= 12999) {
        fee = 699;
    } else if (value >= 13000 && value <= 16999) {
        fee = 799;
    } else if (value >= 17000 && value <= 21999) {
        fee = 899;
    } else if (value >= 22000 && value <= 29999) {
        fee = 999;
    } else if (value >= 30000 && value <= 40999) {
        fee = 1299;
    } else if (value >= 41000 && value <= 80999) {
        fee = 1399;
    } else if (value >= 81000 && value <= 100000) {
        fee = 1499;
    }

    registrationFee.textContent = fee.toLocaleString('pt-MZ') + ' MZN';
}

loanAmount.addEventListener('input', updateLoanValues);
updateLoanValues(); // Initialize values

// Modal functionality
const loginBtn = document.getElementById('loginBtn');
const supportBtn = document.getElementById('supportBtn');
const loginModal = document.getElementById('loginModal');
const supportModal = document.getElementById('supportModal');
const closeButtons = document.querySelectorAll('.close-modal');

loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

supportBtn.addEventListener('click', function() {
    supportModal.style.display = 'flex';
});

closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        loginModal.style.display = 'none';
        supportModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === supportModal) {
        supportModal.style.display = 'none';
    }
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailPhone = document.getElementById('loginEmailPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    // In a real implementation, this would validate credentials with the server
    // For demonstration, we'll show an alert
    alert('Login realizado com sucesso! Redirecionando para a área do cliente...');
    loginModal.style.display = 'none';
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animated');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.9) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Payment integration constants
const privateKey = "208|zA8jnafv3A6DmsTJkdiDwIeLqCmycDKcaiPMGKhsd95a74fc";
const paysuiteURL = "https://paysuite.tech/api/v1/payments";

// Function to create payment request
async function criarPedidoPagamento(payload) {
    if (!payload?.amount || !payload?.reference) {
        throw new Error('Os campos "amount" e "reference" são obrigatórios.');
    }

    const response = await fetch(paysuiteURL, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + privateKey,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar pedido de pagamento.');
    }

    return data;
}

// Form Submission with payment integration
document.getElementById('loanForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        emailPhone: document.getElementById('emailPhone').value,
        province: document.getElementById('province').value,
        neighborhood: document.getElementById('neighborhood').value,
        block: document.getElementById('block').value,
        houseNumber: document.getElementById('houseNumber').value,
        workSector: document.getElementById('workSector').value,
        loanAmount: loanAmount.value
    };
    
    // Calcular taxa de inscrição usando a mesma lógica
    const loanValue = parseInt(formData.loanAmount);
    let feeAmount = 0;
    
    if (loanValue >= 5000 && loanValue <= 8999) {
        feeAmount = 514;
    } else if (loanValue >= 9000 && loanValue <= 12999) {
        feeAmount = 699;
    } else if (loanValue >= 13000 && loanValue <= 16999) {
        feeAmount = 799;
    } else if (loanValue >= 17000 && loanValue <= 21999) {
        feeAmount = 899;
    } else if (loanValue >= 22000 && loanValue <= 29999) {
        feeAmount = 999;
    } else if (loanValue >= 30000 && loanValue <= 40999) {
        feeAmount = 1299;
    } else if (loanValue >= 41000 && loanValue <= 80999) {
        feeAmount = 1399;
    } else if (loanValue >= 81000 && loanValue <= 100000) {
        feeAmount = 1499;
    }
    
    // Create unique reference
    const reference = "LOAN" + Date.now();
    
    // Build payload for payment
    const payload = {
        amount: feeAmount,
        reference: reference,
        description: `Taxa de inscrição para empréstimo de ${formData.loanAmount} MZN`,
        return_url: `https://txeneca.co.mz/success.html`, // Replace with your success URL
        callback_url: `https://txeneca.co.mz/callback.html` // Replace with your callback URL
    };

    try {
        // Save form data to localStorage
        localStorage.setItem("loanData", JSON.stringify(formData));
        const apiKey="v40neq76ixtmmxjt7osqsespylykk0mi2zmajkllkkkdvg0t0tgzd06rkabl";
    const payload={
        "amount": feeAmount,
        "context": `Taxa de inscrição para empréstimo de ${formData.loanAmount} MZN`,
        "callbackUrl": "https://wa.me/",
        "returnUrl": "https://txeneca.co.mz",
        "currency": "MZN",
         "enviroment": "prod"
        }
    const req=await fetch("https://nhonga.net/api/payment/create",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                apiKey
            },
            body:JSON.stringify(payload)
        });
        
    const res=await req.json();
    if(req.status==200){
        window.location.href=res.redirectUrl;
    }else{
        console.log(res);
        throw new Error()
    }
    
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao criar pedido de pagamento. Tente novamente.");
    }
});

// Support modal email button
document.querySelector('.support-btn').addEventListener('click', function() {
    supportModal.style.display = 'flex';
});

// Notificações de empréstimos
function showRandomNotification() {
    const names = ["Xavier", "Ana", "Paulo", "Maria", "Carlos", "Sofia", "Miguel", "Luísa", "João", "Teresa"];
    const provinces = ["Nampula", "Maputo", "Beira", "Gaza", "Tete", "Inhambane", "Sofala", "Zambezia", "Cabo Delgado", "Niassa"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    const loanAmount = Math.floor(Math.random() * 20) * 5000 + 5000; // Valores entre 5.000 e 100.000
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<strong>${randomName}</strong>, de ${randomProvince}, acaba de receber ${loanAmount.toLocaleString('pt-MZ')} MZN!`;
    
    document.getElementById('notificationsContainer').appendChild(notification);
    
    // Remover após a animação
    setTimeout(() => {
        notification.remove();
    }, 8000);
}

// Mostrar primeira notificação após 3s e depois a cada 5s
setTimeout(() => {
    showRandomNotification();
    setInterval(showRandomNotification, 5000);
}, 3000);

// Depoimentos
const testimonials = [
    {
        content: "Recebi o valor no mesmo dia! Obrigado Txeneca",
        author: "João, de Beira"
    },
    {
        content: "Processo simples e taxas transparentes. Recomendo!",
        author: "Maria, de Maputo"
    },
    {
        content: "A equipe de suporte resolveu minha dúvida em minutos.",
        author: "Carlos, de Tete"
    },
    {
        content: "Melhor plataforma de empréstimos que já usei em Moçambique.",
        author: "Sofia, de Nampula"
    },
    {
        content: "Já fiz dois empréstimos e ambas as experiências foram excelentes.",
        author: "Miguel, de Inhambane"
    }
];

let currentTestimonial = 0;
const testimonialContainer = document.querySelector('.testimonials-container');

// Criar elementos de depoimento
testimonials.forEach((testimonial, index) => {
    const testimonialEl = document.createElement('div');
    testimonialEl.className = `testimonial ${index === 0 ? 'active' : ''}`;
    testimonialEl.innerHTML = `
        <p class="testimonial-content">${testimonial.content}</p>
        <div class="testimonial-author">- ${testimonial.author}</div>
    `;
    testimonialContainer.appendChild(testimonialEl);
});

// Rotação de depoimentos
function rotateTestimonials() {
    const allTestimonials = document.querySelectorAll('.testimonial');
    
    // Remover classe ativa atual
    allTestimonials.forEach(t => t.classList.remove('active'));
    
    // Avançar para o próximo
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    
    // Adicionar classe ativa ao próximo
    allTestimonials[currentTestimonial].classList.add('active');
}

// Iniciar rotação a cada 10s
setInterval(rotateTestimonials, 10000);
