let selected = undefined
let sideSelected = undefined 
let verticalSelected = undefined
const phoneMediaQuery = window.matchMedia("(min-width: 37.5em)");

/**
 * Risponde al ridimensionamento della viewport chiudendo la side-nav
 * @param {*} e 
 */
phoneMediaQuery.onchange = (e) => {

    console.log('phoneMediaQuery')
    var sideMenu = document.getElementById('side-menu')
    var checkbox = document.getElementById('hamburger-menu__checkbox')

    if(checkbox.checked) {
        console.log('Chiudo la sidebar!')
        checkbox.checked = false
        sideMenu.style.opacity = 0
        sideMenu.style.visibility = 0
    }
}

/**
 * Attiva l'icona clickata
 * @param {HTMLElement} icon - Icona associata all'evento di click 
 */
function onClickIcon(icon){

    var verticalNav = document.getElementById('vertical-nav')
    var sideNav = document.getElementById('side-menu')
   
    // Rimuovo lo stile dell'icona precedentemente attiva
    for (child of verticalNav.children)
            if(child.classList.contains('active')) child.classList.remove('active')
    
    for (child of sideNav.children)
            if(child.classList.contains('active')) child.classList.remove('active')
       
                     
    // Aggiungo lo stile all'icona attualmente attiva
    if(icon){
        selected = icon 
        console.log(selected)
        for (child of verticalNav.children)
            if(child.classList.contains(selected.classList[0])) child.classList.add('active')

        for (child of sideNav.children)
            if(child.classList.contains(selected.classList[0])) child.classList.add('active')
    } 
}

/**
 * Al caricamento dell'url <hostname>:<port>/<pathname> attiva l'opportuna icona
 * @param {string} icon - Nome della classe associata all'icona
 */
function onRootChange(icon){
    var verticalNav = document.getElementById('vertical-nav')
    var sideNav = document.getElementById('side-menu')
    
    // Aggiorno lo storage
    window.localStorage.setItem('icon-selected', icon)

    // Rimuovo lo stile dell'icona precedentemente attiva
    for (child of verticalNav.children)
            if(child.classList.contains('active')) child.classList.remove('active')
    
    for (child of sideNav.children)
            if(child.classList.contains('active')) child.classList.remove('active')
       
    // Attivo l'icona specificata
    for (child of verticalNav.children)
            if(child.classList.contains(icon)) child.classList.add('active')
    
    for (child of sideNav.children)
            if(child.classList.contains(icon)) child.classList.add('active')
    
}

/**
 * Mostra e nasconde la side-nav in funzione del click sull'hamburger-button
 */
function showSideMenu(){
    var sideMenu = document.getElementById('side-menu')
    var checkbox = document.getElementById('hamburger-menu__checkbox')
   
    if(checkbox.checked){
        sideMenu.style.opacity = 1
        sideMenu.style.visibility = 'visible'
    }
    else{
        sideMenu.style.opacity = 0
        sideMenu.style.visibility = 'hidden'
    }
}