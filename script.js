const cartModal = document.querySelector('#cart-modal')
const menu = document.querySelector('#menu')
const cartBtn = document.querySelector('#cart-btn')
const cartItemsContainer = document.querySelector('#cart-items')
const cartTotal = document.querySelector('#cart-total')
const btnCheckout = document.querySelector('#checkout-btn')
const closeModal = document.querySelector('#close-modal')
const cartCounter = document.querySelector('#cart-count')
const addressInp = document.querySelector('#address')
const msg = document.querySelector('#address-warn')

let cart = []

cartBtn.addEventListener('click', ()=>{
    updateCartModal()
    cartModal.style.display = "flex";
})
closeModal.addEventListener('click', ()=>{
    cartModal.style.display = 'none'
})
cartModal.addEventListener('click', (e)=>{
    if(e.target === cartModal){
        cartModal.style.display = 'none'
    }
})

menu.addEventListener('click', (e)=>{
    let parentBtn = e.target.closest(".add-to-cart-btn")
    if(parentBtn){
        const name = parentBtn.getAttribute('data-name')
        const valor = parseFloat(parentBtn.getAttribute('data-price'))
        addToCart(name, valor)
    }
})

function addToCart(name, valor){
    const existingItem = cart.find(i => i.name === name)
    if(existingItem){
        existingItem.quantidade += 1;
        return
    }else{
        cart.push({
            name, valor, quantidade: 1
        })
    }
    updateCartModal()
}

function updateCartModal(){
    cartItemsContainer.innerHTML= '';
    let total = 0;
    
    cart.forEach(i => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = 
        `
        <div class="flex items-center justify-between mt-4">
            <div>
                <h2 class="font-medium"> ${i.name}</h2>
                <p> preço: ${i.valor.toFixed(2)}</p>
                <p class="font-medium"> quantidade:(${i.quantidade})</p>
            </div>
            <div>
            <button class=" remove-from-btn bg-red-500 text-white rounded px-4 py-1" data-name="${i.name}">Remover</button>
            </div>
        </div>
        `

        total += i.valor * i.quantidade;
        envComand(total)
        cartItemsContainer.appendChild(cartItemElement)
        
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style:"currency", 
        currency:"BRL"
    });

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener('click', (e)=>{
    if(e.target.classList.contains('remove-from-btn')){
        const name = e.target.getAttribute('data-name')

        removeItemCart(name)
    }
})


function removeItemCart(name){
    const index = cart.findIndex(i => i.name === name)
    if(index !== -1){
        const item = cart[index]
        if(item.quantidade >1){
            item.quantidade-=1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1)
        updateCartModal();
    }
}

addressInp.addEventListener('input', (e)=>{
    let InpValue = e.target.value;
    if(InpValue !== ""){
        msg.classList.add('hidden');
        addressInp.classList.remove('border-red-500')
    }
})

btnCheckout.addEventListener('click', ()=>{
    checkHour()
    envComand()
})

function checkHour(){
    
    const isOpen = checkHour()
    if(!isOpen){
        Toastify({
            text: "O estabelecimento está indisponivel!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast onhover
            style: {
            background: "#ef4444", 
        },
        }).showToast();
        return;
    }
    

}


function envComand(total){
    let res = cartTotal
    console.log(res)

    const cartItems = cart.map((i) =>{
        return(
            `${i.name} Quantidade: (${i.quantidade}) Preço: R$:${i.valor}`
        )
    }).join("")
const message = encodeURIComponent(cartItems)
const phone = "16993380636"




if(cart.length === 0) return;
if(addressInp.value ===""){
    msg.classList.remove('hidden')
    addressInp.classList.add('border-red-500')
    return;
}
window.open(`https://wa.me/${phone}?text=${message}Endereço_:${addressInp.value}  total${res})}`, '_blank')



cart = [];
updateCartModal()
}
function checkHour(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora <22;
}
const span = document.querySelector('#date-span')
const isOpen = checkHour()
if(isOpen){
    span.classList.remove('bg-red-500')
    span.classList.add('bg-green-500')
}else{
    span.classList.add('bg-red-500')
    span.classList.remove('bg-green-500')
}
