const visas = [
    {
        modality: 'Tourism',
        type: 'V',
        reach: {
            es: 'Exclusivamente para actividades de ocio, turismo o interés cultural.',
            en: 'Exclusively for leisure activities, tourism or cultural interest'
        },
        vigency: {
            es: 'Hasta un (1) año. La permanencia autorizada en el territorio nacional será de 90 días, prorrogable por otros 90 días calendario, continuos o discontinuos. La permanencia será improrrogable al completar 180 días. continuos o discontinuos dentro de cada trescientos sesenta y cinco (365) días calendario, contados a partir de la expedición de la visa.',
            en: 'Up to one (1) year. The authorized permanence in the national territory will be 90 days, extendable for another 90 calendar days, continuous or discontinued. The permanence will be non-extendable when completing 180 days, continuous or discontinuous within every three hundred and sixty-five (365) calendar days, counted from the issuance of the visa'
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural.',
                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país',
                'Presentar reservación de tiquetes para el ingreso y la salida del país.'
            ],
            en: [
                'Sponsorship from a local host, natural person',
                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country',
                'Submit ticket reservation for entering and leaving the country'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'La visa V Turismo no permite trabajar en el territorio colombiano.',
            en: 'This visa does not allow you to work in Colombian territory'
        }
    },
    {
        modality: 'Business',
        type: 'V',
        reach: {
            es: 'Para realizar gestiones de negocios, estudios de mercado, planes o trámites de inversión directa y constitución de sociedad comercial, negociación, celebración de contratos o representación comercial',
            en: 'To carry out business negotiations, market studies, direct investment plans or procedures and incorporation of a commercial company, negotiation, execution of contracts or commercial representation'
        },
        vigency: {
            es: 'Hasta dos (2) años. La permanencia autorizada en el territorio nacional será de 90 días, prorrogable por otros 90 días calendario, continuos o discontinuos. La permanencia será improrrogable al completar 180 días. continuos o discontinuos dentro de cada trescientos sesenta y cinco (365) días calendario, contados a partir de la expedición de la visa.',
            en: 'Up to two (2) years. The authorized permanence in the national territory will be 90 days, extendable for another 90 calendar days, continuous or discontinued. The permanence will be non-extendable when completing 180 days, continuous or discontinuous within every three hundred and sixty-five (365) calendar days, counted from the issuance of the visa'
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural.',
    
            ],
            en: [
                'Sponsorship from a local host, it can be a natural person or a legal entity',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'La visa V Negocios no permite trabajar en el territorio colombiano ni vincularse al Sistema de Seguridad social en el país.',
            en: 'The V Business visa does not allow you to work in Colombian territory or be linked to the Social Security System in the country'
        }
    },
    {
        modality: 'Student',
        type: 'V',
        reach: {
            es: 'Para realizar estudios presenciales. virtuales o a distancia de educación en arte u oficio, preescolar, primaria, secundaria, media, educación para el trabajo y desarrollo humano. y educación superior; o para efectuar prácticas estudiantiles, e intercambio académico por convenio entre entidades de educación superior. Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su permanencia en Colombia no exceda 180 días calendario',
            en: 'To carry out studies in art or craft, preschool, primary, secondary, high-school, education for work and human development, and higher education; or to carry out student internships, and academic exchanges by agreement between higher education entities. Passport holders from visa-exempt countries or territories, determined by Resolution, will be exempt from processing this type of visa as long as their stay in Colombia does not exceed 180 calendar days.'
        },
        vigency: {
            es: 'Hasta dos (2) años. Excepto para la formación virtual o a distancia, la ausencia del país por más de noventa (90) días calendario dará lugar a la terminación automática de la visa',
            en: 'Up to two (2) years. Except for virtual or distance training, absence from the country for more than ninety (90) calendar days will result in the automatic termination of the visa.'
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural o persona jurídica.',
                'Certificado de admisión o matrícula en la institución educativa donde se indique el grado o programa para el que está admitido o matriculado y su duración',
                'Cuando se trate de prácticas estudiantiles. remuneradas o no, comunicación de la institución educativa que la avale y señalando la duración de la actividad',
                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país',
                'Para segunda y subsiguientes visas, certificación de la entidad del cumplimiento de la asistencia y terminación del curso, estudios o prácticas para los cuales le fue expedida la visa'
            ],
            en: [
                'Sponsorship from a local host. Natural person or legal entity',
                'Admission certificate or enrollement in an educational institution indicating the degree or program for which the foreigner has been admitted or is enrolled, stating the duration of said program',
                'In the case of student internships, whether paid or unpaid, the foreigner must show a letter from the institution that endorses it, stating the duration of the program',
                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country',
                "For second and subsequent student visas, the foreigner must show a certificate from the endorsing institution, proving the student's attendance and completion of the program for which the previous student visa was issued"

            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'Esta visa permite trabajar al estudiante universitario de posgrado, hasta veinte (20) horas semanales previo reporte a la Unidad Administrativa Especial Migración Colombia y al Ministerio de Trabajo por parte del empleador en los sistemas o plataformas dispuestas para este fin.',
            en: 'This visa allows the postgraduate student to work up to twenty (20) hours per week, provided that the foreigner and/or the endorsing institution has reported such circumstance to the Special Administrative Unit - Migracion Colombia and to the Ministry of Labor through the official systems and platforms designed for this purpose'
        }
    },
    {
        modality: 'Medical treatment',
        type: 'V',
        reach: {
            es: 'Para asistir en calidad de paciente o de acompañante de este a consulta, intervención o tratamiento médico y odontológico. Esta visa será otorgada para tratamientos específicos, priorizando aquellos de duración concreta, que hagan parte de la oferta exportable de servicios médicos para extranjeros.',
            en: 'To attend medical or dental consultation, intervention or treatment as a patient or companion. This visa will be granted for specific treatments, prioritizing those of a specific duration, which are part of the exportable offer of medical services for foreigners'
        },
        vigency: {
            es: 'Hasta un (1) año y no será prorrogable en el territorio nacional. La visa V otorgada en esta categoría se considera de turismo y la permanencia en el territorio colombiano no podrá superar los ciento ochenta (180) días calendario continuos o discontinuos',
            en: 'Up to one (1) year and will not be extendable in the national territory. The V visa granted in this category is considered tourism and the permanence in Colombian territory may not exceed one hundred and eighty (180) continuous or discontinuous calendar days'
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural.',
                'Carta de la entidad de salud prestadora del servicio de salud en la que se informe el tipo de tratamiento y duración estimada de la fase de recuperación',
                'Carta del extranjero señalando que los costos de su tratamiento y permanencia en Colombia, serán sufragados por sí mismo o por la entidad extranjera que le respalda y en ningún caso generará servicios a cargo Sistema de salud colombiano',
                'Tanto el paciente como su acompañante: deben contar con una póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país' 
            ],
            en: [
                'Sponsorship by local host. Natural Person',
                'Letter from the health provider entity informing the type of treatment and estimated duration of the recovery phase',
                'Letter from the foreigner indicating that the costs of their treatment and permanence in Colombia will be financed by themselves or by the foreign entity that supports them and in no case will they generate services in charge of the Colombian health system',
                'Both the patient and his companion must have a health insurance policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time planned for their stay in the country',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'No permite trabajar en el territorio colombiano, no permite solicitar visas tipo M. R.',
            en: 'The Medical treatment visa does not allow you to work in Colombian territory. It does not allow you to request Migrant nor Resident visa types.'
        }
    },
    {
        modality: 'Administrative and/or legal procedures',
        type: 'V',
        reach: {
            es: 'Para adelantar trámites de carácter administrativo o judicial ante entidades o autoridades en Colombia',
            en: 'To carry out administrative or judicial procedures before entities or authorities in Colombia'
        },
        vigency: {
            es: 'Hasta un (1) año',
            en: 'Up to one (1) year'
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural.',
                'Documento oficial que sustente el trámite que se encuentra realizando ante autoridad colombiana',
                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente. enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país'
            ],
            en: [
                'Sponsorship from a local host',
                'Official document that supports the process that is being carried out before the Colombian authority',
                'Health insurance policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'Con excepción de los casos en que se otorgue a extranjeros bajo subrogados penales o mecanismos sustitutivos de la pena, la visa V otorgada en esta calidad no permite trabajar en el territorio colombiano.',
            en: 'Except for the cases in which, in the context of a criminal case, the authorities grant you a penalty substitution or surrogate, this visa does not allow you to work in Colombia'
        }
    },
    {
        modality: 'Crew member',
        type: 'V',
        reach: {
            es: 'Para trabajar en aguas jurisdiccionales colombianas como tripulante de embarcación, draga o en plataforma costa afuera',
            en: 'To work in Colombian jurisdictional waters as crew member of a boat, dredger or offshore platform'
        },
        vigency: {
            es: 'Hasta un (1) año',
            en: 'Up to one (1) year'
        },
        requirements: {
            es: [
                'Solicitud con respaldo de persona jurídica.',
                'Copia de la libreta de tripulante',
                'Permiso de autoridad marítima, portuaria y pesquera colombiana, según corresponda'
            ],
            en: [
                'Sponsorship from a legal entity, according to the special rules set in the visas norm',
                'Copy of the crew member booklet',
                'Permit issued by the Colombian maritime, port and fishing authority'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '',
            en: ''
        }
    },
    {
        modality: 'Seasonal agricultural worker',
        type: 'V',
        reach: {
            es: 'Para desarrollar labores agrícolas de temporada bajo programas establecidos por el Ministerio de Agricultura y Desarrollo Rural, o las Gobernaciones en concertación con el sector agrícola, el Ministerio del Trabajo y el Ministerio de Salud y Protección Social, en los que se señalarán los cupos estimados disponibles y las labores en las que se requiere apoyo de mano de obra.',
            en: 'To develop seasonal agricultural work under programs established by the Ministry of Agriculture and Rural Development, or the Colombian local authorities in agreement with the agricultural sector, the Ministry of Labor and the Ministry of Health and Social Protection, in which the quotas will indicate available estimates and the tasks in which labor support is required'
        },
        vigency: {
            es: 'Hasta ciento ochenta (180) días',
            en: 'Up to one hundred and eighty (180) days'
        },
        requirements: {
            es: [
                'Diligenciamiento del formato para trabajador agrícola temporal que se disponga en la página web del Ministerio de Relaciones Exteriores',
                'Comunicación escrita del contratante en la que solicite la visa y señale la idoneidad y experiencia para las labores agrícolas a la que se refiere la convocatoria a la que aplica',
                'Certificado médico expedido por autoridad de salud del país de origen del que surja la aptitud psicofísica para desempeñar las labores a las que se refiera la convocatoria',
                'La empresa contratante se hará cargo de adquirir una póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto de permanencia en el país de los trabajadores'
    
            ],
            en: [
                'Completion of the form available on the website of the Ministry of Foreign Affairs for temporary agricultural workers',
                'Written communication from the contracting party indicating the suitability and experience for the specific agricultural work referred in the correspondent official Convocation or Call-for-work',
                'Medical certificate issued by the health authority of the country of origin indicating the required psychophysical aptitude as described in the official Convocation or Call-for-work',
                'The contracting company will be responsible for acquiring a health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the expected time of permanence in the country of the workers'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: 'Events',
        type: 'V',
        reach: {
            es: 'Para asistir a convenciones y actividades empresariales, culturales o académicas como conferencista, expositor, participante, artista, deportista, jurado, concursante, organizador o personal logístico.',
            en: 'To attend cultural, commercial, academic or artistic activities as an artist, exhibitor, speaker, athlete, jury, participant, contestant, organizer or logistics staff.'
        },
        vigency: {
            es: 'Hasta un (1) año. La permanencia en el territorio nacional será de máximo ciento ochenta (180) días calendario, continuos o discontinuos, improrrogables en cada trescientos sesenta y cinco (365) días calendario desde la expedición de la visa',
            en: 'Up to one (1) year. The permanence in the national territory will be for a maximum of one hundred and eighty (180) calendar days, continuous or discontinued, non-extendable in every three hundred and sixty-five (365) calendar days from the issuance of the visa'
        },
        requirements: {
            es: [
                'Solicitud con respaldo de persona juridica.',
    
            ],
            en: [
                'Sponsorship from the local legal entity that organizes the event',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'No permite trabajar en el territorio colombiano. Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su permanencia en Colombia no exceda 180 días calendario y no reciba salario o sueldo en el país',
            en: 'This visa does not allow you to work in Colombian territory. Passport holders from countries exempt of short-stay visas dont need to apply for this visa, as long as their stay in the territory is no longer than 180 days and do not receive salary in Colombia'
        }
    },
    {
        modality: 'Religious',
        type: 'V',
        reach: {
            es: 'Para trabajar en el ejercicio del ministerio religioso o para ejercer como misionero de una entidad religiosa, debidamente reconocida por el Estado colombiano',
            en: 'To work in the exercise of the religious ministry or to work as a missionary of a religious entity recognized by the Colombian State'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Solicitud a con respaldo de persona jurídica.',
                'Certificado de reconocimiento y representación legal de la respectiva organización religiosa emitido por el Ministerio del Interior o por la Diócesis o Arquidiócesis competente. Para las demás organizaciones religiosas, la Autoridad de Visas e Inmigración consultará su reconocimiento y representación legal en el Registro Público de Entidades Religiosas del Ministerio. En el evento en que no sea posible efectuar dicha consulta, requerirá al interesado para que lo aporte.',
                'Carta motivada del representante legal de la organización religiosa donde informe que el solicitante pertenece a su jerarquía, haga constar el tipo de vínculo o contrato de trabajo, propósito y actividades del extranjero previstas en Colombia y en la cual se responsabilice por la seguridad social y cubrimiento en salud del extranjero',
                'La entidad u organización solicitante deberá acreditar solvencia económica mediante extractos bancarios con un promedio de cien (100) salarios mínimos legales vigentes correspondientes a los seis (6) meses previos a la solicitud.'
            ],
            en: [
                'Sponsorship from a religius organization recognized by the Colombian State',
                "The religious organization's certificate of recognition and legal representation issued by the Ministry of the Interior or by the competent Diocese or Archdiocese. For other religious organizations, the Visa and Immigration Authority will consult their recognition and legal representation in the Public Registry of Religious Entities of the Ministry. In the event that it is not possible to make such a query, the interested party will be required to provide it",
                "Reasoned letter from the legal representative of the religious organization informing that the applicant belongs to its hierarchy; stating the type of bond or employment contract, purpose and activities of the foreigner planned in Colombia; and that the organization will take responsibility for the foreinger's social security and health coverage"
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'El permiso de trabajo otorgado en esta calidad se regirá por el artículo 16 de la resolución 5477 de 2022 y se restringe a la actividad registrada y autorizada en la visa',
            en: 'The work permit granted in this capacity is restricted to the activity registered and authorized in the visa'
        }
    },
    {
        modality: 'Religious students and volunteers',
        type: 'V',
        reach: {
            es: 'Para ingresar y permanecer en el país como voluntario o estudiante en formación religiosa o para llevar a cabo estudios teológicos en instituto u organización de una iglesia o confesión religiosa, debidamente reconocida por el Estado colombiano',
            en: 'To enter and remain in the country as a religious student or volunteer, or to carry out theological studies in an institute or organization duly recognized by the Colombian State'
        },
        vigency: {
            es: 'Hasta un (1) año',
            en: 'Up to one (1) year'
        },
        requirements: {
            es: [
                'Los establecidos en el artículo 32 de la presente resolución.',
                'Certificado de reconocimiento y representación legal de la respectiva organización religiosa emitido por el Ministerio del Interior o por la Diócesis o Arquidiócesis competente',
                'Carta motivada de tal organización religiosa donde consten el propósito y actividades del extranjero previstas en Colombia',
                'Carta de respaldo de la institución religiosa para su sostenimiento, en cuyo caso, la entidad solicitante deberá acreditar solvencia económica mediante extractos bancarios con un promedio de cien (100) salarios mínimos legales mensuales vigentes correspondientes a los seis (6) meses previos a la solicitud',
                'Demostrar que cuenta con cubrimiento de salud en Colombia, o con póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización. muerte o repatriación, por el tiempo previsto para su permanencia en el país'

    
            ],
            en: [
                'Those established in article 32 of this Resolution',
                'Certificate of recognition and legal representation of the respective religious organization issued by the Ministry of the Interior or by the competent Diocese or Archdiocese',
                'Motivated letter from such religious organization stating the purpose and activities of the foreigner planned in Colombia',
                'Letter of support from the religious institution for its support. in which case, the requesting entity must prove economic solvency through bank statements with an average of one hundred (100) current monthly legal minimum wages corresponding to the six (6) months prior to the request',
                'Demonstrate that you have health coverage in Colombia, or a health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for your stay in the country'

    
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'No permite solicitar visa tipo M o R en Colombia. Permite ejercer únicamente la actividad registrada y autorizada en la visa. Una vez terminada la actividad de voluntariado el extranjero deberá regresar a su país de origen o residencia',
            en: ' It does not allow you to apply for a M- or R-type Colombia visa. It allows only the activity registered and authorized in the visa. Once the volunteer activity is over, the foreigner must return to their country of origin or residence'
        }
    },
    {
        modality: 'Visa V Voluntary or Cooperating',
        type: 'V',
        reach: {
            es: 'Para realizar voluntariado de carácter social o de cooperación para el desarrollo',
            en: 'To carry out volunteering of a social nature or cooperation for development'
        },
        vigency: {
            es: 'Hasta dos (2) años La ausencia del país por noventa (90) días calendario o más conllevará a la terminación anticipada de la visa.',
            en: 'Up to two (2) years. Absence from the country for ninety (90) calendar days or more will lead to the early termination of the visa'
        },
        requirements: {
            es: [
                'Carta suscrita por el representante legal de la entidad u organización indicando la actividad, el programa de actividades, lugares donde el voluntario desarrollará los proyectos y su duración, asumiendo la responsabilidad económica de sufragar todos los gastos del extranjero durante su permanencia en Colombia. así como los gastos de regreso al país de origen o al último lugar de residencia del extranjero al término de las actividades',
                
                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país',

                'Documento válido que acredite la personería jurídica de la entidad u organización con no menos de cinco (5) años de constituida, expedido por la autoridad colombiana competente, o documento de constitución en país diferente a Colombia expedido dentro de los tres (3) meses anteriores a la presentación de la solicitud de la visa',

                'La entidad u organización solicitante deberá acreditar solvencia económica mediante extractos bancarios con un promedio de cien (100) salarios mínimos legales vigentes correspondientes a los seis (6) meses previos a la solicitud. Cuando se trate de entidad pública no será necesario cumplir con este requisito',


                
            ],
            en: [
                'Letter signed by the legal representative of the entity or organization indicating the activity, the program of activities, places where the volunteer will develop the projects and their duration, assuming the economic responsibility of defraying all expenses abroad during their stay in Colombia, as well as the expenses of returning to the country of origin or to the last place of residence of the foreigner at the end of the activities',

                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country',

                'Valid document that proves the legal personality of the entity or organization with no less than five (5) years of incorporation, issued by the competent Colombian authority. or document of incorporation in a country other than Colombia issued within the three (3) months prior to the presentation of the visa application',

                'The requesting entity or organization must prove economic solvency through bank statements with an average of one hundred (100) current legal minimum wages corresponding to the six (6) months prior to the request. In the case of a public entity, it will not be necessary to comply with this requirement'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'Podrá ser otorgada a beneficiarios de su titular principal únicamente cuando se considere plenamente justificada.',
            en: 'It may be granted to beneficiaries of its main owner only when it is considered fully justified',
        }
    },
    {
        modality: 'Visa V Cinematographic or audiovisual production',
        type: 'V',
        reach: {
            es: 'Para participar en producciones cinematográficas o documentales de gran formato.',
            en: ' To participate in large-format film or documentary productions.'
        },
        vigency: {
            es: 'Hasta un (1) año.',
            en: 'Up to one (1) year'
        },
        requirements: {
            es: [
                'Los establecidos en el artículo 32 de la presente resolución',

                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país'
    
            ],
            en: [
                'Those established in article 32 of this Resolution',

                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'Esta visa no permite solicitudes en calidad de beneficiario',
            en: 'This visa does not allow applications as a beneficiary' 
        }
    },
    {
        modality: 'Visa V Digital nomads',
        type: 'V',
        reach: {
            es: 'Para prestar servicios de trabajo remoto o teletrabajo, desde Colombia, a través de medios digitales e internet, exclusivamente para empresas extranjeras, como independiente o vinculado laboralmente, o para iniciar un emprendimiento de contenido digital o tecnologías de la in formación de interés para el país',
            en: 'To provide remote work or telecommuting services, from Colombia, through digital media and the Internet, exclusively for foreign companies, as independent or labor-related, or to start a digital content or information technology venture of interest to the country'
        },
        vigency: {
            es: 'Hasta por dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Ser titular de pasaporte expedido por alguno de los países o territorios exentos de visa de corta estancia, según resolución',
                
                ' Carta en español o en inglés, expedida por una o varias empresas extranjeras para la cual preste sus servicios el extranjero en la que se indique el tipo de vínculo y el tipo de remuneración que recibe el solicitante. En caso de tener un contrato con dicha empresa, aportarlo, o demostrar que es socio o copropietario de una empresa en el extranjero y carta indicando que su trabajo para la empresa lo desarrolla de manera remota',

                'En el caso de emprendedores, presentar carta motivacional explicando su proyecto de emprendimiento y los recursos financieros y humanos con que cuenta o aspira a contar para su emprendimiento',

                'Demostrar mediante extractos bancarios contar con ingresos mínimos equivalentes a tres (3) Salarios Mínimos Legales Mensuales Vigentes (smlmv) durante los últimos 3 meses',

                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país',

    
            ],
            en: [
                'Be the holder of a passport issued by any of the countries or territories exempt from short-stay visas, according to the Resolution.',

                'Letter in Spanish or English, issued by one or several foreign companies for which the foreigner provides his services, indicating the type of relationship and the type of remuneration received by the applicant. If you have a contract with said company, provide it, or demonstrate that you are a partner or co-owner of a company abroad and a letter indicating that your work for the company is carried out remotely',

                'In the case of entrepreneurs, present a motivational letter explaining their entrepreneurial project and the financial and human resources they have or aspire to have for their enterprise',

                'Demonstrate through bank statements having minimum income equivalent to three (3) Current Minimum Legal Monthly Wages (SMLMV) during the last 3 months',

                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country'


            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'Se permite su solicitud para beneficiarios del titular principal',
            en: 'This visa does not allow you to work or develop paid activity with a legal or natural person domiciled in the national territory'
        }
    },
    {
        modality: 'Visa V Journalistic coverage',
        type: 'V',
        reach: {
            es: 'Para efectuar cubrimiento periodístico de corta duración en el país',
            en: 'To carry out short-term journalistic coverage in the country'
        },
        vigency: {
            es: 'Hasta un (1} año. La permanencia otorgada para cubrimiento periodístico de corta duración o para permanecer temporalmente como corresponsal de prensa de medio extranjero no podrá superar los ciento ochenta (180) días calendario continuos o discontinuos',
            en: 'Up to one (1) year. The permanence granted for short-term journalistic coverage or to remain temporarily as a press correspondent for a foreign media outlet may not exceed one hundred and eighty (180) continuous or discontinuous calendar days'
        },
        requirements: {
            es: [
                'Los establecidos en el artículo 32 de la presente resolución',

                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país'
    
            ],
            en: [
                'Those established in article 32 of this Resolution',

                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'La visa V otorgada en esta calidad permite ejercer únicamente la actividad específicamente registrada y autorizada en la visa',
            en: 'The V visa granted in this capacity allows only the activity specifically registered and authorized in the visa'
        },

        
        paragraph: { 
            es: 'Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su permanencia en Colombia no exceda 180 días calendario y no reciba salario o sueldo en el país',

            en: 'Passport holders from visa-exempt countries or territories, determined by Resolution, will be exempt from processing this type of visa as long as their stay in Colombia does not exceed 180 calendar days and they do not receive salary or wages in the country'
        }
        
    },
    {
        modality: 'Visa V Permanent Correspondent',
        type: 'V',
        reach: {
            es: 'Para desempeñarse en Colombia como corresponsal de prensa permanente de un medio extranjero',
            en: 'To work in Colombia as a press correspondent permanently from a foreign environment'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Los establecidos en el artículo 32 de la presente resolución',

                'El titular principal y sus beneficiarios deberán acreditar póliza de seguro particular con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación por el tiempo planeado de permanencia en el país'
    
            ],
            en: [
                'Those established in article 32 of this Resolution',

                'The main owner and its beneficiaries must prove a private insurance policy with coverage in the national territory against all risks in the event of an accident. illness, maternity, disability, hospitalization, death or repatriation for the planned time of permanence in the country'
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'Permite a su titular principal solicitar para sus beneficiarios',
            en: 'Allows your main owner to request for their beneficiaries'
        }
    },
    {
        modality: 'Visa V Technical Assistance',
        type: 'V',
        reach: {
            es: 'Para prestar asistencia técnica a persona jurídica en Colombia',
            en: 'To provide technical assistance to legal entities in Colombia'
        },
        vigency: {
            es: 'Hasta dos (2) años. La permanencia en el territorio nacional será de máximo ciento ochenta (180) días calendario, continuos o discontinuos, improrrogables en cada trescientos sesenta y cinco (365) días calendario desde la expedición de la visa',

            en: 'Up to two (2) years. The permanence in the national territory will be for a maximum of one hundred and eighty (180) calendar days, continuous or discontinued, non-extendable in every three hundred and sixty-five (365) calendar days from the issuance of the visa'
        },
        requirements: {
            es: [
                'Los establecidos en el artículo 32 de la presente resolución',

                'Presentar formato resumen de contrato que establezca el Ministerio de Relaciones Exteriores, firmado por la persona jurídica requirente del servicio y el extranjero solicitante de visa',

                'La Autoridad de Visas e Inmigración podrá exigir la presentación del contrato original en los casos en que se requiera verificar en detalle las actividades y responsabilidades a las que se obliga el extranjero'
    
            ],
            en: [
                'Those established in article 32 of this Resolution',

                'Submit a summary format of the contract established by the Ministry of Foreign Affairs, signed by the legal person requesting the service and the foreign visa applicant',

                'The Visa and Immigration Authority may require the presentation of the original contract in cases where it is required to verify in detail the activities and responsibilities to which the foreigner is obliged'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'El permiso de trabajo otorgado permite ejercer únicamente la actividad registrada y autorizada en la visa, y exclusivamente para la persona jurídica requirente. En concordancia con el artículo 16 de la presente resolución, el extranjero y la persona jurídica responsable en Colombia, deberán cumplir con los requisitos específicos de ley, reglamento o manual para el ejercicio de cada profesión u oficio',
            en: 'The work permit granted allows only the activity registered and authorized in the visa, and exclusively for the requesting legal entity. In accordance with Article 16 of this Resolution, the foreigner and the responsible legal person in Colombia must comply with the specific requirements of the law, regulation or manual for the exercise of each profession or trade'
        },

        paragraph: { 
            es: 'Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que se trate de asistencia técnica de carácter urgente y su permanencia en Colombia no exceda treinta (30) días calendario y no reciba salario o sueldo en el país',

            en: 'Passport holders from countries or territories exempt from visas, determined by Resolution, will be exempt from processing this type of visa as long as it is urgent technical assistance and their stay in Colombia does not exceed thirty (30) calendar days and do not receive salary or wages in the country'
        }
    },
    {
        modality: 'Visa V Entrepreneurs FTA',
        type: 'V',
        reach: {
            es: 'Para facilitar la movilidad de empresarios o personas de negocios, en aplicación de compromisos adquiridos por Colombia en el marco de Tratados de Libre Comercio suscritos y en vigor con otros Estados',
            en: 'To facilitate the mobility of entrepreneurs or business people, in application of commitments acquired by Colombia within the framework of Free Trade Agreements signed and in force with other States'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Los señalados en el artículo 32 de la presente resolución, de conformidad con las disposiciones específicas del Tratado de Libre Comercio de que se trate',
                
    
            ],
            en: [
                'Those indicated in Article 32 of this Resolution, in accordance with the specific provisions of the Free Trade Agreement in question',
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'La visa V otorgada en esta categoría permite únicamente la prestación de los servicios registrados y autorizados en la visa, y exclusivamente para la organización requirente',
            en: 'The V visa granted in this category only allows the provision of the services registered and authorized in the visa, and exclusively for the requesting organization'
        }
    },
    {
        modality: 'Visa V Non-accredited officers',
        type: 'V',
        reach: {
            es: 'Para desempeñarse como oficial representante comercial de gobierno de Estado o territorio extranjero, o de agencia gubernamental especializada, en misión que no implique acreditación ante el Ministerio de Relaciones Exteriores',
            en: 'To serve as an official commercial representative of the government of a State or foreign territory, or of a specialized government agency, on a mission that does not imply accreditation before the Ministry of Foreign Affairs'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Comunicación oficial suscrita por el funcionario o representante legal de rango superior de la entidad del país representado',
    
            ],
            en: [
                'fficial communication signed by the official or legal representative of superior rank of the entity of the represented country',
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'Esta visa permite ejercer las actividades solo para la representación gubernamental extranjera',
            en: 'This visa allows activities only for foreign government representation            '
        }
    },
    {
        modality: 'Visa V Holidays and Work',
        type: 'V',
        reach: {
            es: 'To visit the national territory under Vacation and Work Agreements signed by Colombia that are in force.',
            en: 'To visit the national territory under Vacation and Work Agreements signed by Colombia that are in force'
        },
        vigency: {
            es: ' Hasta un (1) año, pudiendo permanecer su titular en el territorio colombiano durante todo el tiempo de vigencia de la visa. La visa V otorgada en esta categoría, concede permiso de trabajo abierto',
            en: 'Up to one (1) year, and the holder may remain in Colombian territory for the entire duration of the visa. The V visa granted in this category grants an open work permit'
        },
        requirements: {
            es: [
                'Presentar la solicitud a través de representación diplomática o consular de Colombia con sede o circunscripción en el país de nacionalidad del interesado',

                'Carta del extranjero manifestando las razones para su solicitud de visa indicando que no ha participado anteriormente en el Programa, y que cumple con el requisito de edad, establecido en el Acuerdo, la cual debe oscilar entre dieciocho (18) y treinta (30) años de edad al momento de la solicitud',

                'Diligenciar el formato de compromiso establecido por el Ministerio de Relaciones Exteriores, el cual se encuentra en la página web de la entidad',

                'Fotocopia o información electrónica del respectivo pasaje de salida de Colombia',

                'Certificación bancaria del solicitante de la visa donde se indique promedio bancario de los últimos tres (3) meses superiores a cinco (5) salarios mínimos legales mensuales vigentes o el límite que establezca el Acuerdo',

                'Cuando el solicitante sea dependiente o invitado, carta de la persona que invite o se responsabilice del extranjero, de su permanencia y salida de Colombia acompañada de su certificación bancaria',

                'Certificado de antecedentes judiciales, penales o de policía expedido por la autoridad del país donde haya permanecido durante los últimos tres (3) años con las formalidades de apostilla o legalización y traducción establecidas en el artículo 21 de la presente resolución',

                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad. maternidad, invalidez. hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país',

                'Formato de Compromiso debidamente diligenciado'
            ],
            en: [
                'Submit the request through diplomatic or consular representation of Colombia with headquarters or district in the country of nationality of the interested party',

                'Letter from the foreigner stating the reasons for their visa application indicating that they have not previously participated in the Programs, and that they meet the age requirement established in the Agreement which must range between eighteen (18) and thirty (30) years of age at the time of the request',

                "Fill out the commitment format, established by the Ministry of Foreign Affairs, which can be found on the entity's website",

                'Photocopy or electronic information of the respective exit ticket from Colombia',

                'Bank certification of the visa applicant indicating the bank average of the last three (3) months higher than five (5) current monthly legal minimum wages or the limit established by the Agreement',

                'When the applicant is dependent or an invitee, a letter from the person who invites or is responsible for the foreigner, for his stay and departure from Colombia accompanied by his bank certification',

                'Certificate of judicial, criminal or police record issued by the authority of the country where you have stayed during the last three (3) years with the apostille or legalization and translation formalities established in Article 21 of this Resolution',

                'Health policy with coverage in the national territory against all risks in case of accident. illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their permanence in the country',

                'Duly completed Commitment Form'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'Esta visa se concederá por una sola vez y no permite solicitar visas M o R en Colombia',
            en: 'This visa will be granted only once and does not allow you to apply for M or R Colombia visa type'
        }
    },
    {
        modality: 'Visa V Professional internship',
        type: 'V',
        reach: {
            es: 'Para actividades de práctica laboral en empresas establecidas en Colombia',
            en: 'For professional internship activities in companies established in Colombia'
        },
        vigency: {
            es: 'Hasta un (1) año',
            en: 'Up to one (1) year'
        },
        requirements: {
            es: [
                'Los señalados en el artículo 32 de la presente resolución',

                'Ser portador de pasaporte de una nacionalidad exenta de visa para estancia de corta duración',

                'Presentar contrato de aprendizaje o pasantía laboral suscrito por la persona jurídica en Colombia',

                'Carta del representante legal de la persona jurídica que vincula al extranjero solicitando la visa, explicando las actividades que desarrollará en el extranjero en el país y responsabilizándose por su seguridad social y de su salida del país al término de su pasantía laboral en Colombia'
    
            ],
            en: [
                'Those indicated in Article 32 of this Resolution',

                'Be a passport holder of a nationality exempt from a visa for short-term stays',

                'Submit an apprenticeship contract or work internship signed by the legal entity in Colombia',

                'Letter from the legal representative of the legal entity that binds the foreigner requesting the visa, explaining the activities that the foreigner will carry out in the country and taking responsibility for their social security and their departure from the country at the end of their work internship in Colombia'
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: 'Visa V - Contractor',
        type: 'V',
        reach: {
            es: 'Para desempeñar labores temporalmente en Colombia bajo contrato de Prestación de servicios, obra o labor',
            en: 'To temporarily perform work in Colombia as a contractor'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Formato resumen de contrato de prestación de servicios, obra o labor, que establezca el Ministerio de Relaciones Exteriores, publicado en la página web de la entidad en el que se consigne claramente la fecha de inicio y finalización del contrato',

                'Carta de motivación del empleador, donde conste la idoneidad, labores a realizar. la formación con que cuenta el extranjero para esta ocupación y las razones por las cuales para dicha actividad no se contrata a un ciudadano colombiano',

                'Cuando se trate empresas del sector minero energético, la Autoridad de Visas e Inmigración consultará en la plataforma de la Agencia Nacional Minera la existencia y vigencia del título minero respectivo. En el evento en que no se pueda consultar, requerirá al interesado para que lo aporte',

                'Certificaciones bancarias a nombre del empleador de los últimos seis (6) meses, en los que se demuestren ingresos promedio mensuales de cien (100) salarios mínimos mensuales legales vigentes (smmlv)',

                'Copia del título profesional apostillado y traducido o certificaciones de laborales y de experiencia que sustenten su idoneidad',

                'Contar con un seguro de salud con cubrimiento en Colombia durante el tiempo de permanencia en el país'
    
            ],
            en: [
                "Contract summary form published on the Ministry of Foreign Affairs website, with the start and end date of the contract",

                'Motivation letter from the employer, stating the suitability, tasks to be performed, skills of the foreigner for this occupation and the reasons why a Colombian citizen is not hired for said activity',

                'When dealing with companies in the mining and energy sector, the Visa and Immigration Authority will consult the platform of the National Mining Agency for the existence and validity of the respective mining title. In the event that it is not possible to consulate, it will require the interested party to provide it',

                'Bank certifications in the name of the employer for the last six (6) months, showing average monthly income of one hundred (100) current legal monthly minimum wages (SMMLV)',

                'Apostilled and translated diploma or experience certificates that support their suitability',

                'Have a health insurance with coverage in Colombia during the time of permanence in the country'
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'Esta visa otorga permiso de trabajo exclusivamente para el cargo, entidad, profesión o actividad para la cual se otorgó',
            en: 'This visa grants a work permit exclusively for the position, entity, profession or activity for which it was granted'
        }
    },
    {
        modality: 'Visa V Promotion of Internationalization',
        type: 'V',
        reach: {
            es: 'Para actividades productivas, de innovación o investigación orientadas a la adopción o adaptación de tecnologías que complementen o desarrollen productos. procesos o servicios que contribuyan a fortalecer la competitividad del país; para actividades que contribuyan a incorporar el conocimiento a las prioridades de los planes de desarrollo nacional, regional y territorial; o para actividades o profesiones preestablecidas por la Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano, que contribuyan a la internacionalización del país',
            en: "For productive, innovation or research activities aimed at the adoption or adaptation of technologies that complement or develop products, processes or services that contribute to strengthening the country's competitiveness; for activities that contribute to incorporating knowledge into the priorities of national, regional and territorial development plans; or for activities or professions pre-established by the Directorate of Immigration, Consular Affairs and Citizen Services. that contribute to the internationalization of the country"
        },
        vigency: {
            es: 'Hasta dos (2) años. La autorización de permanencia en el país será igual a la vigencia de la visa',
            en: 'Up to two (2) years. The automation of permanence in the country will be equal to the validity of the visa'
        },
        requirements: {
            es: [
                'Cumplir con el perfil profesional que establezca la Dirección de Asuntos Migratorios Consulares y Atención al Ciudadano en aplicación de las recomendaciones de la Misión de Internacionalización',
    
            ],
            en: [
                'Comply with the professional profile established by the Directorate of Consular Immigration Affairs and Citizen Services in application of the recommendations of the Internationalization Mission',
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: '',
            en: ''
        }
    },
    {
        modality: 'Visa V Rentist',
        type: 'V',
        reach: {
            es: 'Para extranjeros que reciben una renta periódica y variable de fuente lícita acreditable',
            en: 'For foreigners who receive a periodic and variable income from an accredited lawful source'
        },
        vigency: {
            es: 'Hasta dos (2) años',
            en: 'Up to two (2) years'
        },
        requirements: {
            es: [
                'Carta de solicitud de la visa en la cual se declare el origen de ingresos de la renta',

                'Certificado de antecedentes judiciales, penales o de policía expedido por la autoridad del país donde haya permanecido durante los últimos tres (3) años con las formalidades de apostilla o legalización y traducción establecidas en el Artículo 21 de la presente Resolución',

                'Aportar certificación expedida por entidad pública o empresa privada, reconocida por el Gobierno respectivo, donde se especifique la renta que paga o gira a nombre del extranjero solicitante de la visa; o demostrar que se poseen bienes en Colombia de los cuales se deriva una renta. La cuantía ingresos por rentas no podrá ser inferior a diez (10) salarios mínimos legales mensuales vigentes',

                'Póliza de salud con cobertura en el territorio nacional contra todo riesgo en caso de accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación, por el tiempo previsto para su permanencia en el país'
    
            ],
            en: [
                'Visa application letter in which the source of income of the rent is declared',

                'Certificate of judicial, criminal or police record issued by the authority of the country where you have stayed during the last three (3) years with the apostille or legalization and translation formalities established in Article 21 of this Resolution',

                'Provide certification issued by a public entity or private company, recognized by the respective Government, specifying the income paid or drawn on behalf of the foreign applicant for the visa; or prove that they own assets in Colombia from which an income is derived. The amount of rental income may not be less than ten (10) current monthly legal minimum wages',

                'Health policy with coverage in the national territory against all risks in case of accident, illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen for their stay in the country'
            ]
        },
        benefificaries: 'Yes',
        restrictions: {
            es: 'No permite trabajar en el territorio nacional',
            en: 'It does not allow you to work in the national territory'
        }
    },
    {
        modality: 'isa V Unforeseen cases',
        type: 'V',
        reach: {
            es: 'Esta visa se otorgará para casos y circunstancias no previstas en la presente resolución, de manera excepcional y previa valoración de la Autoridad de Visas e Inmigración',
            en: 'This visa will be granted for cases and circumstances not provided for in this resolution,exceptionally and after assessment by the Visa and Immigration Authority'
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                'A determinar por parte de la Autoridad de Visas e Inmigración',
    
            ],
            en: [
                'To be determined by the Visa and Immigration Authority',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
]

export default visas;