# “RIKYU” Service Level Agreement/Service Level Objectives

<div class="rules-meta" markdown>

RIKEN Center for Computational Science<br>
Enacted on July 6, 2026

</div>

<div class="rules" markdown>

## Introduction { #overview }

“RIKYU” (AI for Science Supercomputer) is operated with the following service level objectives. Although the following service levels are not guaranteed, we make every effort to maintain the objectives through improvement. This document has been prepared, considering the service level objectives of commercial cloud services and other HPC centers.

## Availability { #availability }

### Time of Service Provision { #service-hours }

For the operation of “RIKYU” will always provide the Service except when the Service cannot be provided due to the reasons listed below. Users who use the Service during this service period shall pay usage fees based on the amount of usage as separately prescribed.

- Service interruptions due to scheduled maintenance work that is planned and announced separately
- Service interruptions due to maintenance work that occurs irregularly, such as responses to system failures
- When a user violates the rules of use or laws and ordinances, etc., and the service cannot be used.
- Service is unavailable due to the acts or omissions of users or third parties.
- In the event of failure or malfunction of facilities other than those provided by R-CCS for this service (user environment, communication paths, etc.)
- If R-CCS is unable to provide the service due to factors beyond our control (e.g., natural disasters, soaring utility costs, riots, terrorism, war, acts of government agencies, etc.)
- Other reasons not attributable to R-CCS

In addition, we aim to ensure that the number of active nodes is always maximized.

### Planned Service Suspension { #planned-outage }

In case of the planned suspension of services, such as maintenance, a notification will be given about two weeks in advance.

### Emergency Maintenance { #emergency-maintenance }

For security measures or if failure which may greatly influence the operation of the system occurs, emergency maintenance will be conducted.

We aim to send notifications within three hours after the maintenance is started.

## Support { #support }

### Support Hours and the Method of Communication { #support-hours }

Support for trouble, maintenance, inquiry, etc. is offered from 9:00 till 17:00 weekdays. The request for support is accepted through web form (email will be available until the web form is set up and ready).

\* The support hours exclude the year-end and New Year holidays and other holidays specified by RIKEN.

## System Failure { #failure }

### Failure Detection and Measures { #failure-detection }

The system is monitored for the detection of system failure 24 hours a day throughout the year. Failure notification to users and the system recovery operations are conducted within the support hours described above.

### Notification { #failure-notification }

As for any failure which may influence the whole system, we aim to send notifications within three hours after its detection if it occurs and is detected within the support hours. If it has occurred outside the support hours, we aim to send notifications within three hours after the support hours start the next day.

## Data { #data }

### Storage of Data { #data-storage }

Redundant storage is equipped for storing user data.

Users should organize their data and make an effort not to leave unnecessary data unattended.

### Backup of Data { #data-backup }

No backup of data is provided to users.

### Deletion of Data { #data-deletion }

The data storage allocated to a project will be deleted one month after the date on which use is deemed to have ended, such as the project implementation period end date or the account deletion date.

Please note that the R-CCS may request data deletion due to factors such as storage capacity constraints.

### Restriction of Data Access { #data-access }

Any user’s data is stored in the data storage shared with other users, and access to the storage is restricted by the access control function of UNIX.

## Computational Resources { #resources }

### Amount of Used Resources { #resource-usage }

The amount of computational resources used by a user is calculated used resources hours, which is the product of the system components utilized and the execution time.

If the job execution is terminated abnormally because of, for example node failure, the elapsed time until the termination is considered as the elapsed time.

Users will be charged fees based on the amount of resources used.

### Recovery of Resources { #resource-refund }

In principle, the computational resources used by a user is not recovered. However, we will consider recovering the computational resources if any of the following apply:

<div class="rules-items" markdown>

・Effective failure countermeasures under normal conditions(e.g., checkpoints) do not work due to system problems (In principle, hardware failures are not eligible for recovery.)

・In other cases where there is no way for users to resolve or avoid the problem on their own and R-CCS deems that it is appropriate to recover the computing resources.

</div>

### Priority { #priority }

The job executions are scheduled on a first-come-first-served basis, according to the priority of each project in principle.

## Security { #security }

### Measures { #security-measures }

“[Security White Paper](security-whitepaper.md)” is disclosed to the public for the users to understand our security measures for “RIKYU” and the related facilities.

### Measures Against Security Vulnerability { #vulnerabilities }

If any vulnerability is found in the software used by the system, we apply security patches to it or take other measures, according to the countermeasure standards specified by R-CCS.

### Encryption { #encryption }

Communication between “RIKYU” and the users is encrypted through SSH or HTTPS. The stored data of any user, however, is not encrypted.

</div>
