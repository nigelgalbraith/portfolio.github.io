const jsonData = [
    {
        "ID": 1,
        "Extracts": "NSW Health is changing how it does things to meet challenges. They're putting in a big program to fix clinical, corporate, and tech stuff. Getting the right IT tools is key to making sure these changes last. Before, they had a mess of different systems which made things harder and more expensive. Plus, some of their systems are ancient and hard to support",
        "Wrapper": [
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Reporting Systems",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Business intelligence platforms, dashboard software, data visualization tools.",
                "Factors": "Accuracy of Reporting"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Redundancy Management",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Data deduplication tools, system monitoring, backup and recovery systems.",
                "Factors": "Duplication"
            }
        ]
    },
    {
        "ID": 2,
        "Extracts": "Because of all this, it's hard to share patient info and coordinate care properly. Managers struggle to get accurate info on how well the systems are doing. And keeping them running costs a lot of money.",
        "Wrapper": [
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Legacy Systems",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Mainframe environments, older database systems, on-premises servers.",
                "Factors": "Disparate systems"
            }
        ]
    },
    {
        "ID": 3,
        "Extracts": "This setup could harm the long-term success of the Clinical Services Redesign and Corporate Shared Services. So, they're reshaping the ICT program to fit these reforms better. They're aiming to connect scattered information and tech and quickly support both clinical and corporate changes.",
        "Wrapper": [
            {
                "Sub Groups": "Sustainable Systems",
                "Catergories": "Legacy Replacement",
                "Groups": "Infrastructure and Hardware Management",
                "Sub Catergories": "Migration tools, modernization frameworks, virtualization software.",
                "Factors": "Outdated infrastructure"
            }
        ]
    },
    {
        "ID": 4,
        "Extracts": "Back in 2000, the Integrated Clinical Information Program (ICIP) started based on advice from the NSW Health Council. Its goal is to fix the problems with a clear plan. The idea is to give essential clinical features to all of NSW. They've already made big strides in setting up patient administration, clinical, and corporate systems",
        "Wrapper": [
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "System Silos",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Data integration platforms, cross-department communication tools, centralized repositories.",
                "Factors": "Fragmentation"
            },
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "System Modernization",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Legacy system migration tools, cloud adoption platforms, containerization.",
                "Factors": "Outdated systems"
            },
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "System Interoperability",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Standard protocols (SOAP, REST), API management, messaging queues.",
                "Factors": "Compatibility"
            }
        ]
    },
    {
        "ID": 5,
        "Extracts": "Clinical Systems Strategy\nCorporate Systems Strategy\nBusiness Information Strategy\nSustainable Infrastructure Strategy\nWhole of Government ICT Strategic Directions",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Strategic Planning",
                "Groups": "Business Alignment",
                "Sub Catergories": "Roadmapping tools, portfolio management software, scenario analysis tools.",
                "Factors": "Alignment"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "KPIs / Metrics",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Performance dashboards, data visualization tools, business intelligence platforms.",
                "Factors": "Effectiveness"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Systems Integration",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "ESB, API gateways, event-driven architectures.",
                "Factors": "Integration"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Sustainability Planning",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Environmental monitoring software, sustainability reporting tools, analytics platforms.",
                "Factors": "Sustainability"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Policy & Regulation",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Compliance management systems, policy repositories, audit tools.",
                "Factors": "Compliance"
            }
        ]
    },
    {
        "ID": 6,
        "Extracts": "They're making care safer and better by giving clinicians the info they need and setting up systems for consistent, predictable processes across the state.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Management",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Database management systems, data lakes, cloud storage solutions.",
                "Factors": "Access to information"
            },
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "Standards Adherence",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Code quality tools, compliance software, audit management systems.",
                "Factors": "Consistency"
            },
            {
                "Sub Groups": "Forward-Thinking Leadership",
                "Catergories": "Demand Modeling",
                "Groups": "Strategic Planning and Development",
                "Sub Catergories": "Simulation software, scenario planning tools, demand management platforms.",
                "Factors": "Predictability"
            }
        ]
    },
    {
        "ID": 7,
        "Extracts": "They're improving teamwork among health agencies in NSW, as well as with private companies and nationally, so everyone can work together better. This means info flows more smoothly, helping patients and making things more efficient.",
        "Wrapper": [
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Stakeholder Engagement",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Collaboration platforms, survey software, communication tools.",
                "Factors": "Collaboration"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Standards-based Integration",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "API management, middleware platforms, protocol converters.",
                "Factors": "Interoperability"
            },
            {
                "Sub Groups": "Sustainable Systems",
                "Catergories": "Workflow Management",
                "Groups": "Infrastructure and Hardware Management",
                "Sub Catergories": "Workflow engines, BPM software, task automation platforms.",
                "Factors": "Information flow"
            }
        ]
    },
    {
        "ID": 8,
        "Extracts": "They're expecting to save a lot of money by setting up new structures and ways of doing things. By rolling out key programs quickly, they'll spend less on managing projects, and they can piggyback on existing changes to save even more. This also means less disruption for clinicians and patients and less money spent on training.",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Lean Architecture",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Modular infrastructure, containerization, cloud-native services.",
                "Factors": "Efficient structures"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Deployment Planning",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Project management software, release management tools, configuration management.",
                "Factors": "System deployment & Integration"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Sustainability Planning",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Environmental monitoring software, sustainability reporting tools, analytics platforms.",
                "Factors": "Sustainability"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Risk Mitigation",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Contingency planning software, issue tracking systems, response coordination tools.",
                "Factors": "Minimizing impact"
            },
            {
                "Sub Groups": "Employee development",
                "Catergories": "Training Programs",
                "Groups": "Employee Training and Development",
                "Sub Catergories": "LMS, e-learning platforms, training content management.",
                "Factors": "Streamlined training processes"
            }
        ]
    },
    {
        "ID": 9,
        "Extracts": "The ICT Strategy is built on three main ideas:\nBetter support for clinicians and patient care.\nAligning with big NSW Health plans.\nSaving a lot of money.\n\nThese ideas guide five key objectives:\nUsing ICT to drive big changes in clinical care.\nCutting down on duplicated admin systems and costs.\nProviding top-notch info to everyone in the organization.\nSetting up a flexible ICT system that supports both clinical and corporate reforms.\nManaging ICT in a smart, coordinated way to get the most out of the investment.",
        "Wrapper": [
            {
                "Sub Groups": "Customer service",
                "Catergories": "End-User Support",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Helpdesk software, remote desktop tools, ticketing systems.",
                "Factors": "Support for users"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Program Governance",
                "Groups": "Business Alignment",
                "Sub Catergories": "Governance platforms, risk management tools, compliance dashboards.",
                "Factors": "Alignment with initiatives"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Cost Efficiency",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Resource management platforms, cost tracking systems, optimization algorithms.",
                "Factors": "Cost savings"
            }
        ]
    },
    {
        "ID": 10,
        "Extracts": "ICT Asset Management Strategy\nNSW Health's Enterprise Architecture, which covers:\nClinical Systems Architecture\nCorporate Systems Architecture and Strategy\nBusiness Information Strategy\nInfrastructure Strategy\nIntegration Architecture Strategy\nICT Governance Framework\nICT Portfolio Management and Program of Work\nICT Investment Plan for 2006-2017.",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "IT-Business Alignment",
                "Groups": "Business Alignment",
                "Sub Catergories": "Balanced scorecards, strategy mapping tools, collaboration platforms.",
                "Factors": "ICT Alignment"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Program Oversight",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Project tracking software, status reporting tools, issue management platforms.",
                "Factors": "Governance"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Capacity Planning",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Infrastructure monitoring tools, capacity modeling software, cloud resource management.",
                "Factors": "Investment plans"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Strategic Planning",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Roadmapping tools, portfolio management software, scenario analysis tools.",
                "Factors": "Business strategy"
            }
        ]
    },
    {
        "ID": 11,
        "Extracts": "From the RSP:\nThey've picked out results and services that rely on ICT assets.\nThey've identified risks related to ICT assets that could affect service delivery.\nThey've pinpointed services and measures that hinge on ICT assets working properly.\n\nFrom the NSW Health Corporate Plan:\nThey've considered the overall vision for the community.\nThey've outlined how NSW Health will contribute to this vision.\nThey've focused on strategies to achieve goals, along with potential risks.\nThey've set up ways to measure performance and ensure targets are met.\nThey've looked at the costs involved in reaching the vision and meeting targets.",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "IT-Business Alignment",
                "Groups": "Business Alignment",
                "Sub Catergories": "Balanced scorecards, strategy mapping tools, collaboration platforms.",
                "Factors": "ICT Alignment"
            },
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Risk Management Tools",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Risk registers, compliance monitoring software, reporting dashboards.",
                "Factors": "Risk Identification"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "System Dependencies",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Configuration management databases, dependency mapping tools, orchestration platforms.",
                "Factors": "Dependency"
            }
        ]
    },
    {
        "ID": 12,
        "Extracts": "    Contribution to major service reform agendas and alignment with planned NSW Health priorities and plans.\n    Support for the patient journey across different care settings and improvement of healthcare quality and safety for a large number of people.\n    Ability to enhance efficiency and effectiveness in healthcare delivery and workforce utilization.\n    Adherence to state ICT strategic planning requirements.\n    Potential to generate a positive return on investment.",
        "Wrapper": [
            {
                "Sub Groups": "Budget control",
                "Catergories": "Project Metrics",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "KPI dashboards, analytics tools, reporting software.",
                "Factors": "Evaluation criteria"
            }
        ]
    },
    {
        "ID": 13,
        "Extracts": "They should only add new projects to their investment plan. When it's time to replace old systems, they can handle it through contracts with vendors.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "Equity",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Inclusive design frameworks, accessibility technology, multilingual platforms.",
                "Factors": "Inclusion"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "System Upgrade",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Patch management tools, deployment automation, testing frameworks.",
                "Factors": "Replacement"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Vendor Management",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Procurement software, contract management systems, supplier portals.",
                "Factors": "Procurement"
            }
        ]
    },
    {
        "ID": 14,
        "Extracts": "By 2011, they plan to have core clinical and corporate systems set up across NSW. This will help patients move through the healthcare system smoothly and ensure efficient management. Implementing the ICT Strategy will bring benefits to patients, clinicians, departments, hospitals, areas, and the whole state.",
        "Wrapper": [
            {
                "Sub Groups": "Futureproofing",
                "Catergories": "Scheduling",
                "Groups": "Future Planning and System Demand",
                "Sub Catergories": "Project management software, calendar integration, workflow automation tools.",
                "Factors": "Implementation timeline"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Implementation Planning",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Project management software, resource planning tools, risk assessment platforms.",
                "Factors": "Systems implementation"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Service Desk",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Ticketing systems, knowledge bases, remote support software.",
                "Factors": "Support for Consumers"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "MIS Systems",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Management dashboards, reporting tools, database systems.",
                "Factors": "Management information"
            }
        ]
    },
    {
        "ID": 15,
        "Extracts": "For patients and clinicians, the goal is to have a complete picture of the patient's health history. This way, all healthcare providers can work together effectively, knowing each other's roles and contributions. Corporate systems also support this by giving a clear view of employees, making sure care is delivered smoothly",
        "Wrapper": [
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Stakeholder Engagement",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Collaboration platforms, survey software, communication tools.",
                "Factors": "Collaboration"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Helpdesk / User Services",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Ticketing systems, knowledge bases, live chat and call center software.",
                "Factors": "Consumer support"
            },
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "HR Systems",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Payroll systems, employee databases, performance management platforms.",
                "Factors": "Employee management"
            }
        ]
    },
    {
        "ID": 16,
        "Extracts": "The strategy benefits patients by ensuring clinicians have all the information they need for optimal care, easily accessible whenever and wherever it's needed. This saves clinicians time by reducing the need to search for information or repeat tests unnecessarily, giving them more time for direct patient care.",
        "Wrapper": [
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Personalization",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "User profiling systems, recommendation engines, adaptive UI frameworks.",
                "Factors": "User optimization"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Open Access",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Public portals, content management systems, API gateways.",
                "Factors": "Information accessibility"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Process Automation",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "RPA tools (UiPath, Automation Anywhere), workflow engines, and scripting frameworks.",
                "Factors": "Time efficiency"
            }
        ]
    },
    {
        "ID": 17,
        "Extracts": "Nursing Unit Manager (NUM) can plan patient care better when they know all the demands and resources. This includes patients from the emergency room, post-surgery, and transfers, as well as available beds and staff skills.",
        "Wrapper": [
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Allocation Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Capacity planning software, scheduling tools, resource management platforms.",
                "Factors": "Resource management"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Performance Tuning",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Monitoring tools, system optimization software, load balancers.",
                "Factors": "Capacity optimization"
            },
            {
                "Sub Groups": "Forward-Thinking Leadership",
                "Catergories": "Strategic Planning",
                "Groups": "Strategic Planning and Development",
                "Sub Catergories": "Roadmapping tools, portfolio management software, scenario analysis tools.",
                "Factors": "Planning"
            }
        ]
    },
    {
        "ID": 18,
        "Extracts": "At hospital, area, and department executive levels, having a complete portfolio lets them look at health outcomes, service demand, resources, performance, and finances all together.",
        "Wrapper": [
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Analytics Framework Integration",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Data integration platforms, API gateways, centralized data lakes, and analytics engines.",
                "Factors": "Integrated analysis & System outcome indicators"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Workforce / Budget",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Resource planning tools, budgeting software, workforce analytics.",
                "Factors": "Resource availability"
            },
            {
                "Sub Groups": "Futureproofing",
                "Catergories": "Budgeting Systems",
                "Groups": "Future Planning and System Demand",
                "Sub Catergories": "Accounting software, financial databases, and forecasting tools.",
                "Factors": "Financial management"
            }
        ]
    },
    {
        "ID": 19,
        "Extracts": "The ICT Strategy focuses on key areas and will address them as resources allow. Other initiatives will only be added if they don't affect these core functions or if there's an urgent need.",
        "Wrapper": [
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Resource Prioritization",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Decision support tools, portfolio management software, resource planning platforms.",
                "Factors": "Priority areas & Resource allocation"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Funding Sources",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Financial management systems, grant tracking tools, funding databases.",
                "Factors": "Funding availability"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Core Services",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Application servers, service orchestration platforms, API gateways.",
                "Factors": "Core function delivery & Urgent issue resolution"
            }
        ]
    },
    {
        "ID": 20,
        "Extracts": "By 2011, clinical departments will have improved systems for workflow, decision-making support, and accessing necessary information. This helps clinicians make better decisions for patients, leading to safer care",
        "Wrapper": [
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Business Process Management",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "BPM suites (Appian, Pega), workflow automation tools, and process modeling software.",
                "Factors": "Workflow improvement"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Decision Support Systems",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "BI platforms, predictive analytics engines, data visualization tools.",
                "Factors": "Decision support"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Allocation Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Capacity planning software, scheduling tools, resource management platforms.",
                "Factors": "Resource management"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Open Access",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Public portals, content management systems, API gateways.",
                "Factors": "Information accessibility"
            }
        ]
    },
    {
        "ID": 21,
        "Extracts": "Integrated hospital systems mean information is collected once and available to all, reducing handover issues and improving resource management for smoother patient care.",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Core Platform Integration",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Middleware, API management tools, ESB (Enterprise Service Bus), microservices architecture.",
                "Factors": "Integration of core systems"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Open Access",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Public portals, content management systems, API gateways.",
                "Factors": "Information accessibility"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Allocation Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Capacity planning software, scheduling tools, resource management platforms.",
                "Factors": "Resource management"
            }
        ]
    },
    {
        "ID": 22,
        "Extracts": "The ICT Strategy aims to improve patient care by giving Nursing Unit Managers better information to plan and care for patients, helping hospital executives manage resources and performance, making it easier for departments to access important info and make decisions, integrating key systems across hospitals for smoother patient care, and standardizing information across regions to manage resources and patient transfers more effectively",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Unified Platforms",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Cloud platforms, integrated application suites, API management.",
                "Factors": "Integration of systems"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Open Access",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Public portals, content management systems, API gateways.",
                "Factors": "Information accessibility"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Allocation Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Capacity planning software, scheduling tools, resource management platforms.",
                "Factors": "Resource management"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Standards",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Industry-standard schemas, ontologies, data dictionaries, protocol compliance.",
                "Factors": "Standardized information"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Stakeholder Engagement",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Collaboration platforms, survey software, communication tools.",
                "Factors": "Collaboration"
            }
        ]
    },
    {
        "ID": 23,
        "Extracts": "Rolling out core systems across NSW will have big benefits. Everyone gains, but it's best when the whole state uses them. Standardized info will help NSW Health meet goals by improving patient care, ensuring timely access to services, and better coordination in the health system. Accurate data will help use resources better and manage future needs.",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Implementation Planning",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Project management software, resource planning tools, risk assessment platforms.",
                "Factors": "Systems implementation"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Universal Access",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Responsive web design, cross-platform frameworks, accessibility tools.",
                "Factors": "Standardized information access"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Utilization Metrics",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Monitoring dashboards, analytics platforms, performance tracking tools.",
                "Factors": "Resource utilization"
            },
            {
                "Sub Groups": "Futureproofing",
                "Catergories": "Demand Forecasting",
                "Groups": "Future Planning and System Demand",
                "Sub Catergories": "Statistical modeling software, machine learning platforms, time series analysis tools.",
                "Factors": "Management of future demand"
            }
        ]
    },
    {
        "ID": 24,
        "Extracts": "A steady increase in demand for services is expected due to an aging population. In NSW, the number of people over 65 is growing quickly. Each year from 2012 to 2028, the percentage of older Australians is projected to rise by over 0.35 points annually, which is about four times the long-term average increase.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "Scalability",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Cloud infrastructure, load balancers, elastic resource provisioning.",
                "Factors": "Increased services demand"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Service Design",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "UX/UI design tools, service blueprinting software, customer journey mapping.",
                "Factors": "Service delivery"
            },
            {
                "Sub Groups": "Futureproofing",
                "Catergories": "Future Planning",
                "Groups": "Future Planning and System Demand",
                "Sub Catergories": "Strategic planning software, scenario analysis tools, business intelligence.",
                "Factors": "System projections"
            }
        ]
    },
    {
        "ID": 25,
        "Extracts": "Staff shortages in critical areas such as nursing and medicine Hospitals running at maximum capacity",
        "Wrapper": [
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "Workforce Planning",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "Forecasting tools, capacity planning software, recruitment systems",
                "Factors": "Staff shortages"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Priority Services",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Service catalogues, resource planning tools, demand management software.",
                "Factors": "Critical areas"
            },
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "User Scalability",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Load testing tools, cloud elasticity, session management.",
                "Factors": "User capacity"
            }
        ]
    },
    {
        "ID": 26,
        "Extracts": "The rate of chronic diseases like heart disease, lung disease, diabetes, and cancer is rising. Obesity is becoming more common among young people, and our increasingly globalized society raises the risk of pandemics.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Collection",
                "Groups": "Data and Information Management",
                "Sub Catergories": "ETL tools, data capture applications, IoT sensors, data pipelines.",
                "Factors": "Increase database"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Scalability",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Cloud infrastructure, load balancers, elastic resource provisioning.",
                "Factors": "Rising system usage"
            },
            {
                "Sub Groups": "Sustainable Systems",
                "Catergories": "Business Process Management",
                "Groups": "Infrastructure and Hardware Management",
                "Sub Catergories": "BPM platforms (e.g., Appian, Pega), workflow engines, process automation tools.",
                "Factors": "Future system demand"
            }
        ]
    },
    {
        "ID": 27,
        "Extracts": "An increasing body of medical knowledge that staff cannot manage and\nuse without advanced IT systems",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "KM Systems",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Knowledge bases, document management, collaboration software.",
                "Factors": "Knowledge management"
            },
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "Digital Modernization",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Cloud migration tools, microservices, container orchestration, legacy system refactoring.",
                "Factors": "IT system advancement"
            }
        ]
    },
    {
        "ID": 28,
        "Extracts": "Health services are increasingly challenged by more expensive medical technologies and pharmaceuticals",
        "Wrapper": [
            {
                "Sub Groups": "Futureproofing",
                "Catergories": "Cost Analysis",
                "Groups": "Future Planning and System Demand",
                "Sub Catergories": "Financial analytics software, cost modeling tools, procurement databases.",
                "Factors": "Expensive technologies"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Procurement Strategy",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Vendor management systems, procurement software, contract management tools.",
                "Factors": "Costly materials"
            }
        ]
    },
    {
        "ID": 29,
        "Extracts": "Consumers are becoming more informed, have higher expectations and more complex problems",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Health Literacy Tools",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Patient education portals, multimedia content delivery systems, accessibility software.",
                "Factors": "Informed consumers"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Stakeholder Engagement",
                "Groups": "Business Alignment",
                "Sub Catergories": "Collaboration platforms, survey software, communication tools.",
                "Factors": "High expectations"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Care Coordination Systems",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Patient management systems, health information exchanges, secure messaging platforms.",
                "Factors": "Complex needs problems"
            }
        ]
    },
    {
        "ID": 30,
        "Extracts": "Quality and safety standards are being challenged as demand increases and staff numbers decrease. For instance, from 2000 to 2005, NSW hospitals had an average occupancy of 93%. Some metropolitan hospitals had surgical and medical wards with 95-98% occupancy, while 85% is considered a much safer level.",
        "Wrapper": [
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Compliance Framework",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Governance platforms, risk management tools, regulatory reporting systems.",
                "Factors": "Quality & Safety standards"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "System Scalability",
                "Groups": "Business Alignment",
                "Sub Catergories": "Cloud auto-scaling, load balancing, distributed databases.",
                "Factors": "High user rates"
            },
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "Occupational Safety",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Safety monitoring systems, compliance software, incident reporting tools.",
                "Factors": "Safe working capacity"
            }
        ]
    },
    {
        "ID": 31,
        "Extracts": "The key factors that cause these adverse events are:\n_x0001_ Communication\n_x0001_ Policies and procedures\n_x0001_ Knowledge, skills and competence issues\n_x0001_ Work scheduling",
        "Wrapper": [
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "Communication Tools",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Unified communications systems, VoIP, video conferencing platforms.",
                "Factors": "Communication"
            },
            {
                "Sub Groups": "Forward-Thinking Leadership",
                "Catergories": "Governance",
                "Groups": "Strategic Planning and Development",
                "Sub Catergories": "Policy management systems, compliance tracking, audit management tools.",
                "Factors": "Policies & Procedures"
            },
            {
                "Sub Groups": "Employee development",
                "Catergories": "Workforce Development",
                "Groups": "Employee Training and Development",
                "Sub Catergories": "LMS, career planning software, skills tracking platforms.",
                "Factors": "Skills and competence"
            },
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Scheduling Tools",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Workforce scheduling software, task management systems, resource planners.",
                "Factors": "Work scheduling"
            }
        ]
    },
    {
        "ID": 32,
        "Extracts": "Clinical ICT is becoming an increasingly important enabler of health\nsystem reform, yet the core systems to underpin reform are not\ncurrently in place.",
        "Wrapper": [
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "System Deficit",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Gap analysis tools, system health monitoring, modernization frameworks.",
                "Factors": "Lack of core ICT systems"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Modernization Strategy",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Cloud adoption frameworks, microservices, DevOps toolchains.",
                "Factors": "System reform"
            }
        ]
    },
    {
        "ID": 33,
        "Extracts": "Constraints in capital and recurrent funding, skilled project\nmanagement and implementation resources and capacity of the health\nsystems to accommodate large scale change all restrict the potential\nspeed of implementation of core systems.",
        "Wrapper": [
            {
                "Sub Groups": "Customer service",
                "Catergories": "Budget Constraint Handling",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Financial planning software, cost tracking systems, and resource allocation platforms.",
                "Factors": "Constraints in funding"
            },
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Project Capability",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Project management software, resource planning tools, collaboration platforms.",
                "Factors": "Skilled project management"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Change Readiness",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Readiness assessment tools, survey platforms, stakeholder engagement systems.",
                "Factors": "Capacity for large-scale change"
            }
        ]
    },
    {
        "ID": 34,
        "Extracts": "There are many competing demands for ICT funds. Deciding which projects to prioritize and schedule is complex and needs ongoing review to ensure funds are allocated where they will be most beneficial.",
        "Wrapper": [
            {
                "Sub Groups": "Customer service",
                "Catergories": "Budget Allocation Strategies",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "ERP systems, budgeting modules, and portfolio management software.",
                "Factors": "Competing demands for ICT funds"
            },
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Prioritization Matrix",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Decision support software, scoring tools, resource management platforms.",
                "Factors": "Priority determination"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Project Management",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Scheduling tools, collaboration platforms, resource allocation software.",
                "Factors": "Project scheduling complexity"
            }
        ]
    },
    {
        "ID": 35,
        "Extracts": "NSW Health needs to change how it delivers services to meet these challenges. They've started a big reform program and need the right IT solutions to support staff and make these changes last",
        "Wrapper": [
            {
                "Sub Groups": "Customer service",
                "Catergories": "Integrated Service Design",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Service design software, cross-system integration platforms, user journey mapping tools.",
                "Factors": "Convergence of issues"
            },
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Risk Register",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Risk repository systems, mitigation tracking platforms, compliance dashboards.",
                "Factors": "Significant risk environment"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Service Innovation",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Idea management platforms, R&D tracking software, prototyping tools.",
                "Factors": "Need for service delivery change"
            }
        ]
    },
    {
        "ID": 36,
        "Extracts": "NSW Health is responding to big challenges like more people needing healthcare and not enough staff. They're looking at what the government wants, like improving mental health and using better technology. That helps them decide what to do next and where to spend money.",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Service Planning",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Capacity planning software, demand forecasting tools, strategic planning platforms.",
                "Factors": "Demand for services"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "Business Process Management",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "Application",
                "Factors": "Workforce shortages"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Policy Objectives",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Strategic planning tools, balanced scorecards, performance management software.",
                "Factors": "Government priorities"
            },
            {
                "Sub Groups": "Resilient Execution",
                "Catergories": "Implementation Roadmap",
                "Groups": "Implementation Challenges and Delays",
                "Sub Catergories": "Timeline tools, milestone tracking software, dependency mapping tools.",
                "Factors": "ICT strategies"
            }
        ]
    },
    {
        "ID": 37,
        "Extracts": "The Results and Services Plan guides everything in NSW Health. There are other plans helping out too. The ICT Strategic Plan is one of them, making sure it works well with the main plan. They also look at what the whole government and the country are doing.",
        "Wrapper": [
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Results-Based Planning",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Performance management software, strategic planning tools, reporting dashboards.",
                "Factors": "Alignment with Results and Services Plan"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Strategic Support",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Collaboration platforms, project management tools, communication systems.",
                "Factors": "Support for strategic programs"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Change Management",
                "Groups": "Business Alignment",
                "Sub Catergories": "Collaboration tools, training portals, feedback and adoption tracking systems.",
                "Factors": "Alignment with reform programs"
            },
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "Policy Alignment",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Strategy mapping software, governance frameworks, collaboration platforms.",
                "Factors": "Consideration of whole-of-government strategies"
            }
        ]
    },
    {
        "ID": 38,
        "Extracts": "The RSP is NSW Health's main plan to tackle challenges. They have four main goals:\nKeep people healthy\nProvide needed healthcare\nDeliver top-quality services\nManage health services well\n\nTo achieve these, they focus on seven key directions:\nGet everyone involved in prevention\nImprove people's healthcare experiences\nStrengthen community care\nWork with others for better health\nMake wise choices about healthcare costs\nBuild a strong healthcare workforce\nStay prepared for new challenges and chances",
        "Wrapper": [
            {
                "Sub Groups": "Budget control",
                "Catergories": "Early Intervention Tools",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Predictive analytics, alerting systems, patient monitoring platforms.",
                "Factors": "Preventative solutions"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "UX Design",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Prototyping tools, user testing platforms, accessibility compliance software.",
                "Factors": "User experience"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Forecasting",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Predictive analytics, trend analysis tools, scenario modeling platforms.",
                "Factors": "Future benefits"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Stakeholder Engagement",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Collaboration platforms, survey software, communication tools.",
                "Factors": "Strengthening relationships"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Service Costing",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Cost tracking software, financial planning tools, billing systems.",
                "Factors": "Costs of services"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "HR Strategy",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "Workforce planning tools, talent management software, analytics dashboards.",
                "Factors": "Sustainable Workforce"
            },
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Risk Assessment",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Risk scoring tools, audit management software, compliance tracking systems.",
                "Factors": "New risk potential"
            }
        ]
    },
    {
        "ID": 39,
        "Extracts": "NSW Health wants to prevent sickness and promote good health habits. They're focusing on getting more people vaccinated and helping those at risk for diseases like diabetes. ICT can help by sending alerts about things like missed vaccinations or overdue check-ups",
        "Wrapper": [
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Risk Mitigation",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Contingency planning software, issue tracking systems, response coordination tools.",
                "Factors": "Reducing risk factors"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Risk Management",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Incident tracking software, mitigation planning tools, policy enforcement platforms.",
                "Factors": "Preventing consumer issues"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Predictive Analytics",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Machine learning platforms, data mining tools, statistical software.",
                "Factors": "Interventions for high-risk consumers"
            }
        ]
    },
    {
        "ID": 40,
        "Extracts": "NSW Health wants to make sure everyone gets the care they need, when they need it. They're using tech to support new ways of caring for people and making sure changes stick. Better info during your care journey means a better experience and getting the right care.",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Service Availability",
                "Groups": "Business Alignment",
                "Sub Catergories": "Monitoring systems, failover infrastructure, SLA tracking software.",
                "Factors": "Availability of services"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Service Evaluation",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Survey tools, analytics platforms, performance dashboards.",
                "Factors": "Effectiveness of services"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Capital Planning",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Financial planning software, ERP systems, investment portfolio management tools.",
                "Factors": "Coordination of care"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Model of Care",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Clinical management software, patient engagement platforms, analytics tools.",
                "Factors": "Supporting new care models"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Long-term Planning",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Strategic planning software, forecasting models, scenario analysis tools.",
                "Factors": "Sustainability of reform"
            },
            {
                "Sub Groups": "Sustainable Systems",
                "Catergories": "Journey Mapping",
                "Groups": "Infrastructure and Hardware Management",
                "Sub Catergories": "Customer experience software, analytics platforms, visualization tools.",
                "Factors": "Information flow along consumer journey"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "UX Design",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Prototyping tools, user testing platforms, accessibility compliance software.",
                "Factors": "Consumer experience improvement"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Service Design",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "UX/UI design tools, service blueprinting software, customer journey mapping.",
                "Factors": "Appropriate consumer delivery"
            }
        ]
    },
    {
        "ID": 41,
        "Extracts": "NSW Health aims to improve healthcare by working better together. They're using tech to help everyone collaborate and use resources wisely. That means better tools for healthcare workers and making sure everyone gets great care.",
        "Wrapper": [
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Process Optimization",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Workflow engines, automation platforms, process mining tools.",
                "Factors": "Complexity and duplication in service delivery"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Collaboration Tools",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Team communication apps (e.g., Teams, Slack), document sharing platforms, virtual meeting tech.",
                "Factors": "Need for improved collaboration"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Workflow Systems",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Business process automation tools, collaboration platforms, monitoring software.",
                "Factors": "Enhancement of coordination"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Continuous Improvement",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Performance monitoring tools, quality management software, analytics platforms.",
                "Factors": "Quality and safety improvement"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Resource Optimization",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Automation tools, analytics platforms, load balancing systems.",
                "Factors": "Appropriate resource utilization"
            }
        ]
    },
    {
        "ID": 42,
        "Extracts": "The NSW Government's IT setup influences NSW Health's ICT plan. They aim to make sure NSW initiatives match up with and sometimes even help shape national and statewide plans",
        "Wrapper": [
            {
                "Sub Groups": "Budget control",
                "Catergories": "Risk and Opportunity Analysis",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Risk management platforms, SWOT analysis tools, scenario planning software.",
                "Factors": "Constraints and opportunities"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Policy Compliance",
                "Groups": "Business Alignment",
                "Sub Catergories": "Automated compliance monitoring, reporting systems, risk assessment tools.",
                "Factors": "Alignment with national initiatives"
            }
        ]
    },
    {
        "ID": 43,
        "Extracts": "The NSW Government is changing how they use computers and stuff. They want to save money on the boring tech stuff while keeping important services running smoothly. They're spending more on technology for important services and finding ways to save money with computers. This means using one fund for all tech needs, having a plan for the whole state, using fewer computer programs, sharing tech, and buying things together.",
        "Wrapper": [
            {
                "Sub Groups": "Innovative Evolution",
                "Catergories": "Innovation Strategy",
                "Groups": "System and Technology Improvement",
                "Sub Catergories": "Idea management platforms, R&D tracking software, technology scouting tools.",
                "Factors": "New directions for IT"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Strategic Goals",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Goal-setting software, KPI tracking tools, executive dashboards.",
                "Factors": "Primary goals of Executive Council"
            }
        ]
    },
    {
        "ID": 44,
        "Extracts": "COAG is a group working on important national stuff like mental health, healthcare workers, flu plans, and electronic health records. They're making big plans for healthcare, like making hospitals better and helping people stay healthy. This ICT plan is part of making those plans work by improving healthcare in hospitals and communities",
        "Wrapper": [
            {
                "Sub Groups": "Customer service",
                "Catergories": "Policy Objectives",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Strategic planning tools, balanced scorecards, performance management software.",
                "Factors": "Government priorities"
            },
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Change Strategy",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Strategic planning software, roadmapping tools, business intelligence dashboards.",
                "Factors": "Reform agenda"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Change Initiatives",
                "Groups": "Business Alignment",
                "Sub Catergories": "Change management software, communication platforms, project tracking tools.",
                "Factors": "Business reform"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Inclusive Design",
                "Groups": "Data and Information Management",
                "Sub Catergories": "User research platforms, accessibility testing tools, UI/UX design software.",
                "Factors": "Improvements to Indigenous consumers"
            },
            {
                "Sub Groups": "Forward-Thinking Leadership",
                "Catergories": "Preventive Care Systems",
                "Groups": "Strategic Planning and Development",
                "Sub Catergories": "Health monitoring devices, alerting platforms, patient engagement software.",
                "Factors": "Preventative services"
            }
        ]
    },
    {
        "ID": 45,
        "Extracts": "The eHealth initiative involves all states, territories, and the Australian Government. It began in 2000 to set up e-health across Australia. The Australian Government has invested $128 million in e-health projects across the country, plus an extra $10 million in 2005 for managed health network grants. The aim is to make sure everyone works together, with consistent approaches to eHealth, creating a national health information network. The program also helps make the right rules for eHealth initiatives.",
        "Wrapper": [
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Interagency Cooperation",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Secure collaboration platforms, data sharing agreements, federation technologies.",
                "Factors": "Collaboration across jurisdictions"
            },
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "System Architecture",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Cloud platforms, microservices, network topology management.",
                "Factors": "Consistency in systems approaches"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "National Infrastructure",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Wide area networks, government cloud services, shared service platforms.",
                "Factors": "National information network"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Policy Environment",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Regulatory databases, legislative tracking tools, risk management platforms.",
                "Factors": "Regulatory frameworks"
            }
        ]
    },
    {
        "ID": 46,
        "Extracts": "focuses on developing national health information management and communication technology standards. Its work includes creating frameworks for interoperability, standardizing clinical communications, establishing unique healthcare identifiers, and preparing standards for individual electronic health records, identity management, secure messaging, and supply chain management.",
        "Wrapper": [
            {
                "Sub Groups": "Resilient Execution",
                "Catergories": "Compliance and Standards",
                "Groups": "Implementation Challenges and Delays",
                "Sub Catergories": "Policy management systems, audit tools, compliance tracking software.",
                "Factors": "ICT standards"
            },
            {
                "Sub Groups": "Resilient Execution",
                "Catergories": "Long-term Planning",
                "Groups": "Implementation Challenges and Delays",
                "Sub Catergories": "Strategic planning software, forecasting models, scenario analysis tools.",
                "Factors": "ICT strategic plan"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Standards-based Integration",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "API management, middleware platforms, protocol converters.",
                "Factors": "Interoperability"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Standards",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Industry-standard schemas, ontologies, data dictionaries, protocol compliance.",
                "Factors": "Standardized information"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Identity Management",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Unique identifier systems, authentication protocols, identity federation services.",
                "Factors": "Unique Identifiers"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Digital Health Records",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "EHR/EMR platforms, secure cloud hosting, compliance with health data regulations (HIPAA, etc.).",
                "Factors": "Individual Electronic Record"
            },
            {
                "Sub Groups": "Resilient Execution",
                "Catergories": "IAM",
                "Groups": "Implementation Challenges and Delays",
                "Sub Catergories": "Identity providers, Single Sign-On (SSO), multi-factor authentication, directory services.",
                "Factors": "Identity management standards"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Encrypted Communication",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "End-to-end encryption protocols, secure messaging platforms, PKI infrastructure.",
                "Factors": "Secure messaging"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Logistics Systems",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Supply chain management software, inventory tracking, transportation management.",
                "Factors": "Supply chain management"
            }
        ]
    },
    {
        "ID": 47,
        "Extracts": "To tackle challenges and prepare for the future, NSW Health is changing how it delivers services. Implementing IT solutions to support staff and integrate business processes is key for sustainable service delivery changes.",
        "Wrapper": [
            {
                "Sub Groups": "Budget control",
                "Catergories": "Organizational Change",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Change management platforms, communication tools, training software.",
                "Factors": "Corporate reform program"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Transformation Planning",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Change management platforms, roadmap software, communication tools.",
                "Factors": "ICT reform program"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Rollout Process",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Deployment automation tools, change management software, communication platforms.",
                "Factors": "Implementation of IT solutions"
            }
        ]
    },
    {
        "ID": 48,
        "Extracts": "NEHTA makes sure health info works the same way everywhere in Australia. They're working on stuff like making sure doctors' notes and patient info look the same everywhere. They're also setting up a single ID for healthcare and getting ready for a national health record system. Plus, they're making sure the stuff doctors send each other is safe, and helping with buying healthcare stuff",
        "Wrapper": [
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "ICT Strategic Planning",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Roadmapping tools, portfolio management software, stakeholder collaboration platforms.",
                "Factors": "Development of ICT strategy"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Priority Setting",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Strategic planning tools, stakeholder engagement software, analytics platforms.",
                "Factors": "Investment priorities"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Financial Planning",
                "Groups": "Business Alignment",
                "Sub Catergories": "Budgeting software, forecasting models, financial dashboards.",
                "Factors": "Budget negotiation"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Execution Management",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Project tracking software, status dashboards, resource allocation tools.",
                "Factors": "Program delivery"
            }
        ]
    },
    {
        "ID": 49,
        "Extracts": "Health Support Services sets up and maintains key computer systems for healthcare. They give specific IT help to Area Health Services as defined by the law. This includes managing computers, software, and helping with setting up systems.",
        "Wrapper": [
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Operational Support",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Service management tools, helpdesk platforms, infrastructure monitoring.",
                "Factors": "Responsibilities of Support Services"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Deployment",
                "Groups": "Data and Information Management",
                "Sub Catergories": "CI/CD pipelines, containerization (Docker), infrastructure as code (Terraform).",
                "Factors": "Implementation of system"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "System Operations",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "IT service management platforms, automation tools, incident response systems.",
                "Factors": "Maintenance of systems"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Service Desk",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Ticketing systems, knowledge bases, remote support software.",
                "Factors": "Support for Consumers"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "IT Asset Management",
                "Groups": "Business Alignment",
                "Sub Catergories": "Inventory management systems, hardware monitoring tools, and configuration management databases.",
                "Factors": "Hardware management"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Version Control",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Git, SVN, repository hosting platforms like GitHub, GitLab.",
                "Factors": "Software management"
            }
        ]
    },
    {
        "ID": 50,
        "Extracts": "Area Health Services are responsible for the management of local\nimplementations, change management and training of staff and benefits\nrealisation.",
        "Wrapper": [
            {
                "Sub Groups": "Governance with Integrity",
                "Catergories": "Service Charter",
                "Groups": "Policy and Organizational Reform",
                "Sub Catergories": "Policy management platforms, communication portals, service level documentation.",
                "Factors": "Responsibilities of Services"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Site-Specific Rollouts",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Project management tools, localized deployment platforms, communication systems.",
                "Factors": "Local implementations"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Transition Planning",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Project scheduling, resource allocation software, stakeholder engagement platforms.",
                "Factors": "Change management"
            },
            {
                "Sub Groups": "Employee development",
                "Catergories": "Professional Development",
                "Groups": "Employee Training and Development",
                "Sub Catergories": "Learning management systems, training tracking software, e-learning platforms.",
                "Factors": "Staff training"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Benefits Management Framework",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Performance tracking software, KPI dashboards, and financial modeling tools.",
                "Factors": "Benefits realization"
            }
        ]
    },
    {
        "ID": 51,
        "Extracts": "They pick the most important projects and invest wisely for the health system. We work together on ICT stuff and have clear rules. This helps us decide what to build and how to run things",
        "Wrapper": [
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Portfolio Management",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Project portfolio management (PPM) tools, resource allocation software.",
                "Factors": "Prioritization of programs and projects"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "ROI Analysis",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "Financial modeling tools, business case software, investment tracking systems.",
                "Factors": "Sound investment decisions"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Organizational Value",
                "Groups": "Business Alignment",
                "Sub Catergories": "Performance measurement systems, value tracking tools, business intelligence.",
                "Factors": "Benefit to the organization"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Process Standardization",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "SOP management software, compliance tools, training platforms.",
                "Factors": "Common processes across ICT"
            },
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Governance Structure",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Organizational chart software, collaboration platforms, communication channels.",
                "Factors": "Collaborative framework"
            }
        ]
    },
    {
        "ID": 52,
        "Extracts": "NSW Health uses a coordinated approach to manage ICT projects. This helps us evaluate, prioritize, select, and monitor programs and projects. We adjust as needed to meet our business goals.",
        "Wrapper": [
            {
                "Sub Groups": "Budget control",
                "Catergories": "Project Metrics",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "KPI dashboards, analytics tools, reporting software.",
                "Factors": "Evaluation criteria"
            },
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Decision Framework",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Decision modeling tools, rule engines, workflow automation.",
                "Factors": "Prioritization"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "System Monitoring",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "Monitoring dashboards, alerting systems, log management tools.",
                "Factors": "Monitoring"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Strategic Alignment",
                "Groups": "Business Alignment",
                "Sub Catergories": "Balanced scorecards, strategy mapping tools, performance management platforms.",
                "Factors": "Achieving business priorities"
            }
        ]
    },
    {
        "ID": 53,
        "Extracts": "They have set ways of doing things that support our ICT plan. These cover every step of a project's life.",
        "Wrapper": [
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "ITIL / SOPs",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Process documentation tools, service management platforms, compliance tracking.",
                "Factors": "Standardizing processes across ICT"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Best Practice Implementation",
                "Groups": "Business Alignment",
                "Sub Catergories": "Compliance management systems, policy enforcement software, and audit trail logging.",
                "Factors": "Guidelines application"
            }
        ]
    },
    {
        "ID": 54,
        "Extracts": "To make the strategy work, NSW Health collaborates with the Department of Health, Area Health Services, Health Technology, and third-party providers, using shared decision-making processes and building core applications at the state level",
        "Wrapper": [
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "Joint Program Delivery",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Collaborative project management tools, communication platforms, shared resource pools.",
                "Factors": "Collaborative implementation"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Governance Integration",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Integrated risk management platforms, cross-department workflow tools.",
                "Factors": "Integration of governance models"
            },
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "Dev Standards",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Coding standards enforcement tools, static analysis, version control systems.",
                "Factors": "Consistency in application development"
            }
        ]
    },
    {
        "ID": 55,
        "Extracts": "Applications and projects are categorized as core, common, or divergent, influencing their prioritization, funding, and management, with core ones managed by the Department, common ones collaboratively, and divergent ones allowing for innovative solutions to local needs.",
        "Wrapper": [
            {
                "Sub Groups": "Teamwork enhancement",
                "Catergories": "Application Categorization",
                "Groups": "Collaboration and Communication",
                "Sub Catergories": "Metadata repositories, CMDB systems, and application portfolio management tools.",
                "Factors": "Classification of applications"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "Application Lifecycle Management",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "DevOps pipelines, container orchestration (Kubernetes), version control, and monitoring tools.",
                "Factors": "Management of applications"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Allocation Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Capacity planning software, scheduling tools, resource management platforms.",
                "Factors": "Resource management"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Outcome Measurement",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "KPI tracking tools, performance dashboards, data visualization software.",
                "Factors": "Achieving outcomes"
            }
        ]
    },
    {
        "ID": 56,
        "Extracts": "The Project Governance framework makes sure projects do what they're supposed to and deliver the benefits they promised. It helps NSW Health focus on the right projects and ensures they're done correctly. This way, strategy and delivery stay connected, reducing risks for the whole portfolio",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Business Case Development",
                "Groups": "Business Alignment",
                "Sub Catergories": "Project management tools, ROI calculators, and collaboration platforms.",
                "Factors": "Alignment with business benefits"
            },
            {
                "Sub Groups": "Accountable Risk Management",
                "Catergories": "Risk Management Tools",
                "Groups": "Risk Identification and Management",
                "Sub Catergories": "Risk registers, compliance monitoring software, reporting dashboards.",
                "Factors": "Risk Identification"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Execution Gap",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Performance monitoring, gap analysis tools, workflow optimization software.",
                "Factors": "Disconnect of strategy and implementation"
            }
        ]
    },
    {
        "ID": 57,
        "Extracts": "In the Content Development phase, they design and build a prototype, then review it with clinicians. We use a method called Fast Track, which makes the process quicker. The prototype helps clinicians understand the application better and decide if it works for them",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Software Development Lifecycle",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Version control systems, CI/CD pipelines, code review tools.",
                "Factors": "Development process"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Methodological Compatibility",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Standards compliance tools, integration frameworks, API adapters.",
                "Factors": "Integration with existing methodology"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Data Analytics and Reporting",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Data warehouses, BI tools (like Power BI, Tableau), ETL processes, and real-time dashboards.",
                "Factors": "Informed decision-making"
            }
        ]
    },
    {
        "ID": 58,
        "Extracts": "In the Implementation phase, they're putting in the content decided by the state. Doing it all at once might seem like a lot, but it's the most efficient and cost-effective way. Using the Fast Track Method makes things quicker and cheaper, sticking to a standard design with state content. This means less hassle and less time spent learning for Area Health Services staff. Their team knows how to build the database, and doing things fast helps them stick to the plan without adding extra stuff.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "ECM (Enterprise Content Management)",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Document management systems, metadata tagging, workflow automation.",
                "Factors": "Large content management"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Resource Bottlenecks",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Performance monitoring, workflow analysis software, optimization tools.",
                "Factors": "Resource constraints"
            },
            {
                "Sub Groups": "Employee development",
                "Catergories": "LMS",
                "Groups": "Employee Training and Development",
                "Sub Catergories": "E-learning platforms, content management systems, training analytics software.",
                "Factors": "Skills / Training"
            },
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Project Governance",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Risk and compliance software, stakeholder management tools, reporting dashboards.",
                "Factors": "Scope creep"
            }
        ]
    },
    {
        "ID": 59,
        "Extracts": "The SBB uses a maturity model to improve its features over time, with all Area Health Services contributing to each version, changes requiring approval from the majority of the Application Advisory Group, and new versions released annually, featuring required core functions, modifiable features, and local content.",
        "Wrapper": [
            {
                "Sub Groups": "Consistent Excellence",
                "Catergories": "User Accessibility Solutions",
                "Groups": "Standardization and Streamlining Processes",
                "Sub Catergories": "Accessibility APIs, adaptive UI frameworks, assistive technologies, and responsive design across platforms.",
                "Factors": "Equal system participation"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Governance",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Policy management systems, compliance tracking, audit management tools.",
                "Factors": "Change control process"
            },
            {
                "Sub Groups": "Regulatory adherence",
                "Catergories": "Application Design Strategy",
                "Groups": "Compliance and Governance",
                "Sub Catergories": "Modular architecture, microservices, API management, and user-centered design platforms.",
                "Factors": "Core functionality vs area-specific needs"
            }
        ]
    },
    {
        "ID": 60,
        "Extracts": "The Clinical Systems Strategy aims to implement essential clinical systems supporting Clinical Services Redesign, Quality and Safety initiatives, and clinical programs. It focuses on improving communication, reducing delays, and supporting patient care, ensuring resources are allocated flexibly to meet patient needs",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Strategic Planning",
                "Groups": "Business Alignment",
                "Sub Catergories": "Roadmapping tools, portfolio management software, scenario analysis tools.",
                "Factors": "Alignment"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Timeline Risk",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Project risk management software, scheduling tools, issue tracking.",
                "Factors": "Implementation delays"
            },
            {
                "Sub Groups": "Customer service",
                "Catergories": "Resource Management",
                "Groups": "Consumer Experience and Support",
                "Sub Catergories": "Workforce management software, budgeting tools, project tracking systems.",
                "Factors": "Allocation of resources"
            }
        ]
    },
    {
        "ID": 61,
        "Extracts": "Three programs support the Clinical Systems Strategy: the Electronic Medical Record program for managing patients in hospitals, the Primary, Community, and Outpatient Care program for community care, and the Clinical Support program for essential support systems like Patient Administration and diagnostics.",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Program Oversight",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Project tracking software, status reporting tools, issue management platforms.",
                "Factors": "Management of programs"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Unified Platforms",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Cloud platforms, integrated application suites, API management.",
                "Factors": "Integration of systems"
            },
            {
                "Sub Groups": "Budget control",
                "Catergories": "Integration Architecture",
                "Groups": "Financial Management and Budgeting",
                "Sub Catergories": "API gateways, ESB, microservices architecture, message brokers.",
                "Factors": "Compatibility between systems"
            }
        ]
    },
    {
        "ID": 62,
        "Extracts": "The Corporate Systems Strategy sets up essential systems to support the Corporate Shared Services reform program, cutting duplication and costs in administrative tasks to redirect funds to frontline care, with the Corporate Systems program as its backbone.",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Case Management Systems",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "CRM systems, document management, integrated health IT platforms.",
                "Factors": "Integration of unified systems"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Business Continuity Planning",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Backup and recovery systems, failover clusters, and disaster recovery platforms.",
                "Factors": "Disruption to processes"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Cybersecurity",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Firewalls, intrusion detection systems, endpoint protection, identity and access management.",
                "Factors": "Data security"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Privacy and Security",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Encryption tools, access control systems, data loss prevention software.",
                "Factors": "Data privacy"
            }
        ]
    },
    {
        "ID": 63,
        "Extracts": "The Business Information Strategy aims to provide timely, high-quality information throughout the organization, fostering a performance-driven culture. It helps turn data into insights, supports decision-making, aligns with strategic goals, ensures accountability, and follows the overall program and change management approach.",
        "Wrapper": [
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Responsiveness",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Incident management systems, alerting platforms, customer support software.",
                "Factors": "Timeliness"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Data Quality",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Data cleansing tools, validation software, profiling and monitoring tools.",
                "Factors": "Accuracy of data"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Reporting Systems",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Business intelligence platforms, dashboard software, data visualization tools.",
                "Factors": "Accuracy of Reporting"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Data Interoperability",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Data integration platforms, API connectors, standard data exchange protocols (e.g., HL7, FHIR).",
                "Factors": "Integration of data"
            },
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "Platform Architecture",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Cloud platforms, microservices architecture, container orchestration.",
                "Factors": "Unified platform"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Open Data / Interoperability",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Open data standards, APIs, data portals.",
                "Factors": "Data accessibility"
            },
            {
                "Sub Groups": "Data integrity",
                "Catergories": "Privacy and Security",
                "Groups": "Data Security, Quality and Privacy",
                "Sub Catergories": "Encryption tools, access control systems, data loss prevention software.",
                "Factors": "Data privacy"
            }
        ]
    },
    {
        "ID": 64,
        "Extracts": "Three programs support the Business Information Strategy: one delivers useful information to front-line staff, another integrates strategic frameworks and develops performance measures, and the third ensures systems can provide consistent data and sets up technical infrastructure",
        "Wrapper": [
            {
                "Sub Groups": "Strategic Project Leadership",
                "Catergories": "Decision Framework",
                "Groups": "Program and Project Management",
                "Sub Catergories": "Decision modeling tools, rule engines, workflow automation.",
                "Factors": "Prioritization"
            },
            {
                "Sub Groups": "Strategic Cohesion",
                "Catergories": "Strategic Planning",
                "Groups": "Business Alignment",
                "Sub Catergories": "Roadmapping tools, portfolio management software, scenario analysis tools.",
                "Factors": "Alignment"
            },
            {
                "Sub Groups": "Responsive Support",
                "Catergories": "System Monitoring",
                "Groups": "System Maintenance and Support",
                "Sub Catergories": "Monitoring dashboards, alerting systems, log management tools.",
                "Factors": "Monitoring"
            }
        ]
    },
    {
        "ID": 65,
        "Extracts": "The Sustainable Infrastructure program aims to streamline technical infrastructure, establish and uphold standards and architecture for statewide ICT initiatives, and ensure maximum benefit from ICT investments.",
        "Wrapper": [
            {
                "Sub Groups": "Data governance",
                "Catergories": "Infrastructure Optimization",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Network monitoring, virtualization platforms, cloud cost management tools.",
                "Factors": "Infrastructure efficiency"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Standards",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Industry-standard schemas, ontologies, data dictionaries, protocol compliance.",
                "Factors": "Standardized information"
            },
            {
                "Sub Groups": "Sustainable Efficiency",
                "Catergories": "Efficiency Tools",
                "Groups": "Resource Management and Utilization",
                "Sub Catergories": "Monitoring software, load balancers, resource scheduling platforms.",
                "Factors": "Resource optimization"
            }
        ]
    },
    {
        "ID": 66,
        "Extracts": "The Sustainable Infrastructure program includes three parts: setting up infrastructure, establishing technical standards, and ensuring uniform data standards across systems in NSW.",
        "Wrapper": [
            {
                "Sub Groups": "Reliable Implementation",
                "Catergories": "System Integration",
                "Groups": "System Deployment and Integration",
                "Sub Catergories": "Middleware, API gateways, data transformation services.",
                "Factors": "Infrastructure coherence"
            },
            {
                "Sub Groups": "Process optimization",
                "Catergories": "Compliance Management",
                "Groups": "Operational Effectiveness and Efficiency",
                "Sub Catergories": "Workflow enforcement tools, automated compliance monitoring, reporting dashboards.",
                "Factors": "Standard adherence"
            },
            {
                "Sub Groups": "Data governance",
                "Catergories": "Data Governance",
                "Groups": "Data and Information Management",
                "Sub Catergories": "Data cataloging, metadata management, master data management systems.",
                "Factors": "Data quality"
            }
        ]
    }
];