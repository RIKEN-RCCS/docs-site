# Login

This system provides two login methods: <span class="text-marker">connecting to the Open OnDemand server over HTTPS from a web browser</span> and <span class="text-marker">connecting to a login node over SSH from terminal software</span>. After logging in with either method, submit jobs from the login destination server to compute nodes through the [Slurm job scheduler](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }. Place data on shared storage for use.

![How to use](img/howtouse.png){ width="500" }

## Open OnDemand

Open OnDemand is a web portal that lets you use the supercomputer from a web browser. Log in to Open OnDemand from the link below.

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }

For details, see [Using Open OnDemand](ood.md).

## Terminal Software

Before connecting over SSH from terminal software, you need to register your SSH public key with this system from Open OnDemand. Log in to Open OnDemand from the link below.

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }

Launch "SSH Public Key". The following screen appears. Enter your SSH public key in the text area under "Add a Public Key", then click the "Add" button. When registration succeeds, the registration information appears under "Registered Public Keys".

![SSH public key](img/sshpubkey.png){ width="800" }

After registering your public key, you can log in over SSH from terminal software with the following command. Replace `USERNAME` with your user name.

```bash
$ ssh USERNAME@login.rikyu.r-ccs.riken.jp
```

For information on submitting jobs from the command line, see [Using Slurm](slurm.md).
