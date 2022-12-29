import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useEffect } from 'react';

const options = [
  { label: '1. Abonos; Aditivos para combustibles; Productos químicos', value: '1' },
  { label: '2. Pinturas, barnices, lacas, esmaltes.', value: '2' },
  { label: '3. Cosméticos; perfumería; productos de aseo', value: '3' },
  { label: '4. Aceites para uso industrial, ceras; lubricantes; velas', value: '4' },
  { label: '5. Productos farmacéuticos; suplementos dietéticos; material de impastes dentales', value: '5' },
  { label: '6. Materiales de construcción metálicos; Artículos de ferretería; Contenedores', value: '6' },
  { label: '7. Máquinas y herramientas mecánicas; Motores; Instrumentos agrícolas', value: '7' },
  { label: '8. Herramientas que funcionan manualmente; Cuchillería, tenedores y cucharas; máquinas de afeitar', value: '8',},
  { label: '9. Software y aplicaciones web y móbiles. Aparatos e instrumentos científicos, de investigación, de grabación.', value: '9' },
  { label: '10. Aparatos e instrumentos quirúrgicos, médicos, odontológicos y veterinarios; Protesis;', value: '10' },
  { label: '11. Aparatos e instalaciones de alumbrado, calefacción, enfriamiento u otros', value: '11',},
  { label: '12. Vehículos; aparatos de locomoción terrestre, aérea o acuática', value: '12',},
  { label: '13. Armas de fuego; municiones y proyectiles', value: '13' },
  { label: '14. Accesorios; Artículos de joyería; Oro; Metales preciosos y sus aleaciones;', value: '14' },
  { label: '15. Instrumentos musicales y sus herramientas; guitarras; pianos; baterías;', value: '15',},
  { label: '16. Papel y cartón; fotografías; artículos de papelería y artículos de oficina', value: '16' },
  { label: '17. Caucho, goma; Tuberías, tubos y mangueras', value: '17' },
  { label: '18. Bolsos, maletas, billeteras; Sombrillas; Cinturones; Cuero y cuero de imitación;', value: '18' },
  { label: '19. Materiales de construcción no metálico; Tuberías y monumentos no metálicos;', value: '19' },
  { label: '20. Muebles, espejos, marcos', value: '20',},
  { label: '21. Utensilios y recipientes para uso doméstico y culinario; Vajillas; Ollas; Sartenes', value: '21' },
  { label: '22. Cuerdas y cordeles; redes; tiendas de campaña y lonas', value: '22' },
  { label: '23. Hilos e hilados para uso textil;', value: '23' },
  { label: '24. Tejidos y sus sucedáneos; ropa de hogar; Cortinas; Edredones; Fundas; Manteles', value: '24' },
  { label: '25. Ropa; Vestigos; Pijamas; Pantalones; Calzado; artículos de sombrerería.', value: '25' },
  { label: '26. Encajes, cordones y bordados; Botones; Alfileres y agujas; Adornos para el cabello; Cabello postizo', value: '26' },
  { label: '27. Alfombras, felpudos, esteras y esterillas, linóleo y otros revestimientos de suelos', value: '27' },
  { label: '28. Juegos y juguetes; aparatos de videojuegos; artículos de gimnasia y deporte; Adornos para árboles de navidad', value: '28' },
  { label: '29. Alimentos frescos; Carne, pescado; frutas y verduras, hortalizas y legumbres en conserva', value: '29' },
  { label: '30. Alimentos procesados; Café, té, cacao y sus sucedáneos; arroz, pastas alimenticias y fideos; harinas y preparaciones a base de cereales...', value: '30' },
  { label: '31. Productos agrícolas, acuícolas, hortícolas y forestales en bruto y sin procesar; Hierbas; Animales vivos;', value: '31' },
  { label: '32. Cervezas; bebidas sin alcohol; aguas minerales y carbonatadas; Zumo de frutas; Siropes', value: '32' },
  { label: '33. Bebidas alcohólicas, excepto cervezas; Aguardiente; Whisky; Ron; Vodka; Vinos...', value: '33' },
  { label: '34. Tabaco; cigarrillos y puros; cigarrillos electrónicos y vaporizadores...', value: '34' },
  { label: '35. Publicidad; Márketing; Asesoría contable; Redes sociales; Tiendas en línea; Gestión comercial', value: '35' },
  { label: '36. Servicios financieros y bancarios; servicios de seguros; negocios inmobiliarios', value: '36' },
  { label: '37. Servicios de construcción; servicios de instalación y reparación ', value: '37' },
  { label: '38. Servicios de telecomunicaciones; Podcasts; Comunicación por radio; Difusión de programas de televisión.', value: '38' },
  { label: '39. Transporte; Agencias de turismo; Depósitos de mercancías y materiales; Alquiler de carros y motocicletas', value: '39' },
  { label: '40. Tratamiento de materiales; reciclaje de residuos y desechos; purificación del aire y tratamiento del agua', value: '40' },
  { label: '41. Educación; formación; Organización de eventos; Conciertos; Servicios de entretenimiento; actividades deportivas y culturales', value: '41' },
  { label: '42. Servicios científicos y tecnológicos. Diseño arquitectónico; Consultoría técnica y profesional; Diseño y desarrollo de hardware y software', value: '42' },
  { label: '43. Servicios de restaurantes, bares, hostales y hoteles', value: '43' },
  { label: '44. Servicios médicos; servicios veterinarios; Tratamientos de higiene y de belleza para personas o animales; Servicios de agrónomos;', value: '44' },
  { label: '45. Servicios jurídicos; servicios de seguridad privada; funerarias', value: '45' },
];

const Cotizador = () => {
  const [selected, setSelected] = useState([]);
  const [calidad, setCalidad] = useState(null);
  const [tasas, setTasas] = useState(0);
  const [honorarios, setHonorarios] = useState(0);
  const [estudio, setEstudio] = useState(0);


  const handleChange = (e) => {
    setCalidad(e.target.value); 
  } 

  const calculate = () => {
    let numeroClases = selected.length
         
    if (numeroClases >= 1 && numeroClases <= 3){                     
        setHonorarios(380000)
        setEstudio(115000)
    }
    else if (numeroClases > 3) {
        setHonorarios(700000 + ((numeroClases-3) * 75000) )
        setEstudio(115000 + (numeroClases-3) * 50000)
    }
     else {
        setHonorarios(0);
        setEstudio(0)
    } 


    if (calidad === 'normal') {
        if (numeroClases > 1){                          
            setTasas(1003500 + (numeroClases * 501500)-501500 )
        } else if (numeroClases === 0) {
            setTasas(0);
        } else {
            setTasas(1003500);
        }
    } else if (calidad === 'sas') {
        if (numeroClases > 1){                
            setTasas(723000 + (numeroClases * 361500)-361500 )
        } else if (numeroClases === 0) {
            setTasas(0);
        } else {
            setTasas(723000);
        }
    } else if (calidad === 'menor') {
        if (numeroClases > 1){                
            setTasas(69000 + (numeroClases * 69000)-69000 )
        } else if (numeroClases === 0) {
            setTasas(0);
        } else {                
            setTasas(69000);
        }
    } else {
        setTasas(0);
        setHonorarios(0);

    }

  }

useEffect(() => {  
  calculate()
 })


  return (
    <div className="m-4 p-3 container mx-auto">
      <h4>Calcula aquí cuánto valdría registrar tu marca</h4>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="w-80 max-w-96">
          <h4>Selecciona tu calidad</h4>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">SAS</span> 
              <input type="radio" name="radio-10" value="sas" className="radio checked:bg-red-500" onChange={handleChange}  />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Full</span> 
              <input type="radio" name="radio-10" value="normal" className="radio checked:bg-blue-500" onChange={handleChange}  />
            </label>
          </div>


          <h4>Selecciona las clases</h4>
          <div className="w-80 max-w-96">
            <MultiSelect
              className="text-black"
              focusSearchOnOpen
              hasSelectAll={false}
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
              />
          </div>
        </div>
        <div className="resumen">
          <h4>Resumen</h4>
          <div className="clases">
            <span>Clases seleccionadas:</span>
            <ul>
              {selected.map((clase,l) => <li key={l}>{clase.label}</li> )}
            </ul>
          </div>
          <span>Calidad: {calidad ? calidad : 'selecciona tu calidad'}</span>
          <h4>Valores:</h4>
          <h4>Tasas: {tasas ? tasas : '0'}</h4>
          <h4>Estudio previo: {estudio ? estudio : '0'}</h4>
          <h4>Honorarios: {honorarios ? honorarios : 'selecciona clases y calidad'}</h4>
          <h4>Total:{tasas+honorarios+estudio}</h4>
        </div>
      </div>
    </div>
  );
};

export default Cotizador;