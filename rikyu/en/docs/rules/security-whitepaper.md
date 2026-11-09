# “RIKYU” Security White Paper

!!! warning "Machine translation"

    This page is a machine translation of the Japanese original, provided for your convenience. The Japanese version is the official text, and it takes precedence if there is any discrepancy. See the [Japanese version](https://docs.r-ccs.riken.jp/rikyu/ja/rules/security-whitepaper/){ target="_blank" rel="noopener" }.

<div class="rules-meta" markdown>

RIKEN Center for Computational Science<br>
July 2026

</div>

<div class="rules" markdown>

## 1　Introduction { #section-1 }

The RIKEN Center for Computational Science (hereinafter referred to as the "Center") aims to provide the AI for Science Supercomputer (hereinafter referred to as "RIKYU") as a highly available and reliable service. With regard to security, the Center has established a comprehensive security management process with reference to an information security management system (ISMS), covering the protection of physical facilities, network protection, data protection, incident response, and more. This document describes the security efforts for "RIKYU" and the points that users should consider regarding security.

## 2　Shared Security Responsibility { #section-2 }

"RIKYU" adopts a shared security responsibility model that clearly defines the roles of the Center and its users. The Center manages and is responsible for the security of the "RIKYU" computer itself, its storage, software, and network, and the facility in which "RIKYU" is installed. Users are responsible for managing their own information, data, user accounts, and credentials.

### 2.1　Scope of the Center's Responsibility { #section-2-1 }

The Center is responsible for managing the hardware, such as the "RIKYU" computer itself and its storage systems, as well as the system software that constitutes "RIKYU" and the applications installed by the Center. The Center is also responsible for the operation and management of the external network and the facility equipment.

The Center places emphasis on managing the following items.

- Access to physical facilities
- Network management
- Protection of the infrastructure
- Management of system software
- Data protection

### 2.2　Scope of the Users' Responsibility { #section-2-2 }

Users of "RIKYU" are required to manage the following.

- Proper management of accounts (requests for registration and deletion, granting of administrative privileges, etc.)
- Management of credentials
- Management of data

## 3　Platform Security { #section-3 }

The Center's facilities are designed to ensure physical and environmental security for operating "RIKYU". Security guards are stationed at the Center's facilities at all times, and visitors are required to wear an access card (ID card). In addition, the inside and outside of the Center are monitored by a video surveillance system. The computer room in which "RIKYU" is installed is clearly separated from the staff work areas, and only some staff members with access rights can enter the computer room. The building itself is equipped with various disaster countermeasures and has mechanisms that allow the operation of "RIKYU" to continue.

### 3.1　Security Surveillance { #section-3-1 }

#### Entry and Exit Control

Entry to and exit from areas within the Center are controlled by an entry and exit management system using ID cards and electric locks. Starting with entry to and exit from the building, only authorized persons can enter specific areas, and the entry of other persons is restricted or prohibited. In addition, a history of who entered which area and when is recorded and managed.

#### Security Equipment and Video Surveillance System

The Center has security equipment, a surveillance system, and a monitoring room covering the entire Center. The video surveillance system covers not only the inside of the Center's buildings but also the premises, and cameras are installed at the entrances of each room and along the routes visitors take to the computer room. Recording is carried out 24 hours a day, 365 days a year, and the recorded data is stored for a long period.

#### Security Guards

Security guards are stationed at the entrance of the building at all times and check visitors (identity verification, advance registration, contacting the person in charge, etc.). All visitors are required to wear an ID card on a dedicated strap.

### 3.2　Disaster Countermeasures { #section-3-2 }

#### Earthquake Countermeasures

The Center's buildings have a seismically isolated or earthquake-resistant structure, designed to maintain the Center's functions even in a large-scale earthquake.

#### Flood and Salt Damage Countermeasures

The Center is located on land developed at a ground height above the assumed maximum tsunami water level (6 m above sea level), so the area has a low risk of flooding and tsunamis. In addition, as countermeasures against salt damage due to its location near the coastline, walls and windows are doubled, and salt removal filters are installed at the outside air intakes.

#### Fire Countermeasures

The Center is equipped with automatic fire alarm equipment. In particular, the computer room in which "RIKYU" is installed and the electrical room are equipped with ultra-high-sensitivity smoke detectors, and powder fire extinguishers and carbon dioxide fire extinguishers for initial fire fighting.

#### Lightning Countermeasures

The Center has countermeasures against direct lightning strikes and side flashes.

#### Power Supply Equipment

The Center has secured power supply routes via two high-voltage transmission lines from a substation. In addition to an in-house gas turbine power generation facility that runs at all times, UPS units and emergency generators are installed, making it possible to supply power continuously and stably to important equipment even during momentary voltage drops and power outages.

## 4　Operational Security { #section-4 }

So that users can use the computational resources of "RIKYU" with peace of mind, the Center follows industry best practices for security processes and carries out the following operations.

- Least-privilege management
- A secure network and system environment
- Management of user data
- Regular vulnerability scanning
- Logging and alerting for operational monitoring
- System change management
- Established procedures for responding to and recovering from security incidents

### 4.1　Access Management { #section-4-1 }

#### Access Management of User Accounts

Procedures have been established for operations related to the creation of user accounts and access rights, in order to manage privileges appropriately and strictly. User accounts have an expiration date, and expired accounts are suspended as needed. The privileges of user accounts are set to the minimum privileges required to use the system.

#### Technical Access Management

Users can connect to "RIKYU" over the web (HTTPS) or a shell (SSH) using PKI (public key infrastructure). Users can also connect to "RIKYU" through an encrypted tunnel by connecting to "RIKYU" over a virtual private network (VPN).

The private keys of the "RIKYU" certificate authority and hosts are managed securely according to security policies and procedures for protecting the keys.

### 4.2　Network Security { #section-4-2 }

Network security is implemented using a combination of physical and logical controls. Protection and defense against malicious communication are implemented through network security and monitoring technologies, such as firewalls, network vulnerability scanning, and network security monitoring.

The Center's network is segmented according to its use. The main networks are as follows.

- Internet-facing DMZ
- The "RIKYU" network
- The Center's general business intranet

#### Network Separation

The intranet used for the Center's general business and the "RIKYU" network are completely separated, and they cannot communicate with each other. In addition, the necessary controls are in place to prevent network connections by unauthorized devices and personnel.

#### Firewalls

"RIKYU" has firewalls in place to monitor and control inbound and outbound communication with the internet. In principle, all communication from external networks is denied, and only the communication provided as services of "RIKYU" is permitted after the change management procedure and a security audit have been carried out. In principle, all communication from "RIKYU" to the outside is permitted.

#### Communication Security

SSH or HTTPS can be used to access "RIKYU". A VPN service to the "RIKYU" network is also provided. Secure communication is ensured under strong encryption protocols, and the encryption of confidential data is supported.

### 4.3　Data Management { #section-4-3 }

A data deletion process for user data upon the end of a "RIKYU" usage agreement, and a disposal process including confidentiality protection measures for disposing of IT assets reliably and securely in cases such as equipment failure, have been defined.

#### Data Storage

Redundant storage is provided for storing user data. Users are required to organize their data and make efforts not to leave unnecessary data unattended.

#### Data Deletion

The data area allocated to a project or similar is deleted one month after the date on which use is deemed to have ended, such as the end date of the project period or the account deletion date. Deleted data cannot be restored in any way.

#### Data Backup

No backup of user data is performed. Users should back up their data themselves as necessary.

#### Data Encryption

User data on storage is not encrypted.

### 4.4　Threat and Vulnerability Management { #section-4-4 }

System management procedures for detecting threats effectively and accurately have been established. In addition, information on vulnerabilities is obtained as it becomes available, and the risks to "RIKYU" are analyzed and addressed.

#### Vulnerability Scanning

The Center performs regular scans of the "RIKYU" network to detect unauthorized services and to check for high-risk security threats and vulnerabilities. If a high-risk service is found, security patches are applied.

#### Security Patch Management

"RIKYU" has patch management procedures for applying security patches safely and quickly. Patches to all servers and network devices are applied after analyzing their impact on system stability. Important patches for highly urgent vulnerabilities are applied promptly, and other patches are applied during scheduled maintenance after determining whether to apply them.

### 4.5　Operational Monitoring { #section-4-5 }

#### Log Monitoring

"RIKYU" provides high availability by using various automated monitoring systems for each device (physical hosts, network, storage, etc.) that maintains the service. Important logs are checked daily, and any problems are escalated and resolved.

#### Liveness Monitoring

Each device and service is automatically checked at regular intervals, and operations staff are alerted in the event of a failure. Many of the important systems that make up "RIKYU" are redundant, ensuring availability as a whole.

#### Performance Monitoring

Performance information of each device and service is measured, and operations staff are alerted if a threshold is exceeded for a certain period of time. The cause is also investigated, and countermeasures are taken, including removing the cause or expanding the system. In addition, the operational monitoring system notifies operations staff of information on physical environmental changes and the failure or deterioration of parts, preventing performance degradation.

#### Resource Monitoring

The resource utilization of each device and service is measured, and operations staff are alerted if a threshold is exceeded. The cause of the excess is also investigated, and removing the cause or expanding resources is considered.

### 4.6　System Change Management { #section-4-6 }

All system changes are carried out after confirming that they meet security requirements.

#### Procedure for System Changes

Procedures for system changes are defined, and only authorized operations staff can carry them out in accordance with the change management process. All changes go through an approval process before being carried out and are recorded. Recovery procedures are prepared in advance in case problems arise from a change. Changes to the system, including patches, are applied to the production environment after their operation has been verified in a test environment.

#### Notification to Users

The Center provides information on the support site about system changes that may affect users. The information provided is as follows.

- A description of the system change
- The scheduled date and time of the change, and the date and time it was carried out

### 4.7　Incident Management { #section-4-7 }

When an incident occurs, the Center responds in cooperation with RIKEN's CSIRT or related departments in accordance with the information security implementation procedures established by RIKEN.

The Center may ask users for cooperation in order to track the status of an information security incident. In that case, the methods and means will be announced separately. In addition, information on incidents, including minor incidents that do not affect the service, is recorded to prevent recurrence.

#### Incident Notification

When an incident occurs, information is communicated to the relevant parties based on predefined response procedures, and the incident is investigated and addressed. In addition, incident information is disclosed to users on the website or by email in accordance with the criteria.

#### Where to Report a Detected Incident

If a user detects an incident while using "RIKYU", please contact the "Contact" listed on the support site.

## 5　Privacy and Compliance { #section-5 }

The Center has established various documents regarding the privacy and data of "RIKYU" users and handles data in accordance with these standards.

### 5.1　Data Privacy { #section-5-1 }

The handling of data on "RIKYU" is published in the following two documents.

- [Guidelines for users’ data stored on “RIKYU”](user-data.md)

    Sets out the handling of the files of "RIKYU" users and the data collected by the Center.

- [On the Handling of Personal Data for “RIKYU”](personal-data.md)

    Sets out the handling of the personal information and access logs of "RIKYU" users.

### 5.2　Security Audits { #section-5-2 }

#### Internal Audits

RIKEN's security department regularly audits the network services of "Fugaku" for vulnerabilities.

#### Third-Party Audits

Audits of operations and security are regularly carried out by external organizations. When risks are found as a result of an audit, countermeasures for improvement are implemented based on priority.

## 6　Summary { #section-6 }

This document has described the Center's security efforts, so that users can use "RIKYU", provided by the RIKEN Center for Computational Science, with peace of mind as a highly reliable and available computing service. With reference to an information security management system (ISMS), the Center has established a comprehensive security management process covering the protection of physical facilities, network protection, data protection, incident response, and more. In addition, by striving to ensure thorough security in physical, technical, and administrative aspects, the Center provides computational resources safely and achieves the security measures that users require.

</div>
