# Guidelines for users’ data stored on “RIKYU”

<div class="rules-meta" markdown>

RIKEN Center for Computational Science<br>
Enacted on July 6, 2026

</div>

<div class="rules" markdown>

This document is an English translation of the document written in Japanese and is for information purposes only. Users should also refer to the “Regulations for Use of “RIKYU””

The RIKEN Center for Computational Science (hereinafter referred to as “R-CCS”) shall manage users’ data on “RIKYU” (AI for Science Supercomputer) as specified below.

## 1.　Files stored on “RIKYU” by the users { #section-1 }

R-CCS shall treat programs, data necessary for calculations, and calculation results stored on the storage devices of (hereinafter referred to as the “Files”) by users who are permitted to access “RIKYU” in accordance with the guidelines below.

<div class="rules-items" markdown>

(1) R-CCS takes necessary preventive measures and manages the Files properly to prevent leaks and loss or damage of the Files.

(2) R-CCS does not access the Files except when troubleshooting or improvement of “RIKYU” system necessitates access to the Files. When R-CCS needs to access the Files, R-CCS confirms users if R-CCS can access the Files. R-CCS does not access the Files contain genomic information or other personal information.

(3) R-CCS does not backup the Files. Users are expected to backup their Files if necessary.

(4) Users shall endeavor to organize Files and not retain unnecessary Files for extended periods. Files whose retention period generally exceeds one year should be promptly backed up or deleted.

(5) R-CCS shall promptly delete the Files that are kept on the storage devices for a month after expiration of the user’s allotted period of use of “RIKYU”.

</div>

## 2.　Data collected by R-CCS { #section-2 }

R-CCS shall collect the following data (hereinafter referred to as “Data”) during the operation of “RIKYU”:

- **Job Information**

    Information of jobs, such as the history of the job execution, etc.

- **Job Scripts**

    The scripts used for the job execution

- **Performance Information**

    Information of the program performance, such as FLOPS, memory throughput, power consumption, usage of the energy-saving organization, file I/O, usage of GPUs, etc.

- **Compiler Information**

    Information of compiling, such as the library used, the compiler used, programing model, etc.

- **File Information**

    Information of files kept on the storage devices, such as the file size, creation date, update history, file allocation information, etc.

- **Network Information**

    Information of communication between external and compute nodes, frontend servers, etc. of “RIKYU”, such as access points, contents of communication packets, etc.

R-CCS shall treat the Data in accordance with the guidelines below.

<div class="rules-items" markdown>

(1) R-CCS shall use the Data for the purpose of analysis of the program performance and system usage to improve the usability by the users, and not for other purposes.

(2) R-CCS shall not disclose the Data to third parties except in the following cases:

<div class="rules-items" markdown>

1)　When sharing information with the organization responsible for utilization promotion operations separately designated by the R-CCS for the purpose of enhancing user convenience for improving “RIKYU” operations and responding to help desk tasks. The organization must observe the Guidelines.

2)　When operation and maintenance of “RIKYU” are outsourced to a third party, and handling of the Data by the third party becomes necessary. In this case, the third-party personnel conducting the operation and maintenance work shall observe the provisions of these guidelines.

3)　When collaborative research with other institutions is conducted to improve the system operation. In this case, the collaborating institutions shall observe the provisions of these guidelines.

4)　When research on improving the system operation is published, or disclosure of the Data improves the usability by the users. In this case, the disclosed information shall be deidentified and shall not contain any identifiable personal information. Generally, the information used for research publications is kept for 10 years.

5)　When disclosure is requested by legal process.

6)　When disclosure is requested by the project administrator.

</div>

</div>

</div>
