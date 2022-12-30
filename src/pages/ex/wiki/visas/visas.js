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
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                'Solicitud a título personal o con respaldo de persona natural.',
    
            ],
            en: [
                'Application in a personal capacity or with the support of a local host',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'La ',
            en: 'The '
        }
    },
    {
        modality: 'Business',
        type: 'V',
        reach: {
            es: '',
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
                'Application in a personal capacity or with the support of a local host',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: 'La visa V Negocios no permite trabajar en el territorio colombiano ni vincularse al Sistema de Seguridad social en el país.',
            en: 'The V Business visa does not allow you to work in Colombian territory or be linked to the Social Security System in the country'
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
            ]
        },
        benefificaries: 'No',
        restrictions: {
            es: '.',
            en: ''
        }
    },
    {
        modality: '',
        type: 'V',
        reach: {
            es: '',
            en: ''
        },
        vigency: {
            es: '',
            en: ''
        },
        requirements: {
            es: [
                '.',
    
            ],
            en: [
                '',
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