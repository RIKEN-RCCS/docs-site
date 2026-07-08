!!! info

    Early Access Phase 2 for production operation is currently underway. Early Access Phase 2 is scheduled to continue until the end of September 2026.

# Welcome

The Supercomputer RIKYU is a system installed at the [RIKEN Center for Computational Science](https://www.r-ccs.riken.jp){ target="_blank" rel="noopener" } to accelerate scientific discovery through AI. The system consists of 400 compute nodes equipped with NVIDIA GB200 NVL4, for a total of 1,600 NVIDIA Blackwell GPUs. Its FP64 performance is 64.160 PFLOPS, and its FP8 performance is 15.539 EFLOPS.

This user guide explains how to use the Supercomputer RIKYU.

!!! note

    This user guide includes various command examples. The leading `$` or `%` in these examples represents the command prompt and should not be typed. Unless otherwise noted, Bash is used as the shell.

## Account Application

To apply for an account on this system, use the RIKYU Account Application System (RAAS) below.

[Account Application](https://raas.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }

!!! note

    Users continuing from Early Access Phase 1 must also submit a new account application. Early Access Phase 2 is available to ARiSE users, members of accepted SPReAD1000 projects, and RIKEN members. To use this system, users must register their personal information, and the project representative must register the project, add project members, and complete the required project procedures.


!!! note

    Early Access Phase 1 accounts will be maintained for the time being only during the data migration period. However, they cannot be used to run jobs or use other compute resources. Data will not be migrated automatically, so users must transfer any necessary data to the Early Access Phase 2 environment themselves.

## Usage Fees

The usage fee for this system is 300 yen per GPU hour. For example, using 4 GPUs for 5 hours costs 4 GPUs &times; 5 hours &times; 300 yen = 6,000 yen. Consumption tax is charged separately. Usage fees are billed in arrears as a lump sum after the end of Early Access Phase 2.

To check your current usage, refer to the billing system below.

[Billing System](https://portal.rikyu.r-ccs.riken.jp/en/){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }
