//CONSTRUCTORES: se crean los constructores para poder agregarles prototypes
function Seguro(marca,year,tipo){ //estructura de objeto 
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
// Realiza la cotización con los datos 
Seguro.prototype.cotizarSeguro = function(){
 /*
  1= Americano 1.15
  2= Asiatico 1.05
  3=Europeo 1.35
  */

 let cantidad;
 const base = 2000;
 
  switch(this.marca){
     case '1':
        cantidad = base * 1.15;
        break;
     case '2':
        cantidad = base * 1.05;
        break;
     case '3':
        cantidad = base * 1.35;
        break;
    
     default: break;
  }
  
//   leer año
 const diferencia = new Date().getFullYear() - this.year;

// cada año que la diferencia es mayor, el costo va a reducirse  un 3%
  cantidad -= ((diferencia * 3 ) * cantidad) / 100;
  
/*
   Si el seguro es básico se multiplica por un 30% más
   Si el seguro es completo se multiplica por un 50% más
*/ 
if(this.tipo === 'basico'){
    cantidad *= 1.30;
}else{
    cantidad *= 1.50;
}

return cantidad;
}


function UI(){ }// estructura de objeto interfaz de usuario

// llena las opciones de los años 
UI.prototype.llenarOpciones = ()=>{ // se utiliza arowfunction porque no necesito this
    const max= new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');

    for(let i=max; i>min; i--){
        //crear y agregar años
        let option = document.createElement('option');
        option.value = i; //obtenemos los valores
        option.textContent = i;
        selectYear.appendChild(option);
        
    }

}

//Muestra aletar en pantalla 
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const div = document.createElement('div');

    if( tipo ==='error') {
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;
 
    //Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout( ()=>{
        div.remove();
    },3000)
}

UI.prototype.mostrarResultado = (total,seguro) =>{

    const {marca, year, tipo} = seguro; //Destructuring 

    let nombreMarca;
    
    switch(marca){
        case '1':
            nombreMarca = 'Americano';
            break;
        case '2':
            nombreMarca = 'Asiatico';
            break;
        case '3':
            nombreMarca = 'Europeo';
            break;
        default:
            break;
    }

    // crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header"> Resumen </p>
        <p class="font-bold">Marca: <span class="font-normal"> ${nombreMarca}</span> </p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span> </p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span> </p>
        <p class="font-bold">Total: <span class="font-normal"> $${total}</span> </p>
    `;

    //agregando div al id de resultado del html 
    const resultadoDiv = document.querySelector('#resultado')
   

    //Mostrar el spinner 
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; //Se borra el spinner 
        resultadoDiv.appendChild(div); // se muestra el resultado
    }, 3000);
}

// Instanciar UI GLOBAL
const ui = new UI(); // se pone por fuera del eventlistener porque se va  pasar por diferentes funciones 
// console.log(ui);

document.addEventListener('DOMContentLoaded',()=>{
    ui.llenarOpciones(); //Llena el select con los años 
})

//EVENLISTENERS
eventlistener();
function eventlistener(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    // console.log('cotizando...')
    //    validacion de formulario
    // leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    // console.log(marca);

    // leer el año seleccionado
    const year = document.querySelector('#year').value;

    // leer el tipo de seguro 
    const tipo = document.querySelector('input[name="tipo"]:checked').value;//leer input de tipo radio
    // console.log(tipo)

    if(marca === '' || year ==='' || tipo === ''){
        // console.log('No paso la validacion ')
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('contizando...', 'correcto');

    //Ocultar las cotizaciones previas 
     const resultados = document.querySelector('#resultado div');
     if(resultados != null){
        resultados.remove();
     }

    //Instanciar el seguro  
    const seguro = new Seguro(marca, year, tipo);
    const total =  seguro.cotizarSeguro();
    //  console.log(seguro);

    // Utilizar el prototype que va a cotizar 
    ui.mostrarResultado(total,seguro);
}