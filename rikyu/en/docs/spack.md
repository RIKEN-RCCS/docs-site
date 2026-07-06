# Spack

## 0. How to Read This Manual

This manual explains how to use software on RIKYU.
Software is managed with **Spack**.

To use software that has already been built by the system, first read **Chapters 1 and 2, and Chapters 5 and 6 as needed**.
Read the private instance instructions in **Chapter 7** only if you need to build OSS yourself.

!!! note

    The `$` and `%` characters at the beginning of command examples are prompts. Do not type them.

| Purpose | Chapters to read |
|---|---|
| Use prebuilt software | Chapters 1, 2, 3, 5, and 6 |
| Use GPU-enabled software | Chapters 1, 2, 3, 5, and 6 |
| Use MPI applications | Chapters 1, 2, 3, 4, 5, and 6 |
| Resolve multiple packages with the same name | Chapter 6 |
| Build software yourself | Chapters 1, 7, and 8 |


## 1. Terminology

| Term | Meaning |
|---|---|
| Spack | A package management tool commonly used on supercomputers and HPC systems. It can manage multiple versions, compilers, MPI implementations, GPU-enabled builds, and other build variants separately. |
| OSS | Open Source Software. In this manual, this refers to open source software provided by the system, such as cp2k, gromacs, lammps, and quantum-espresso. |
| Public instance | A Spack environment managed by the system. Frequently used OSS is provided as prebuilt software. In normal use, start with this environment. |
| Private instance | A Spack environment created by a user in their home directory or another user-controlled location. Use this when you need OSS that is not provided by the system or custom build conditions. |
| Chaining | A feature that lets a private instance refer to prebuilt packages in the public instance. It can reduce the need to build dependencies from scratch. |
| spec | A Spack package specification. It includes not only the package name, but also the version, compiler, dependencies, build options, and other settings. |
| Hash | A short identifier that Spack uses to distinguish prebuilt packages. Use it when multiple packages have the same name. |


## 2. Basic Procedure for the Public Instance

Use the procedure in this chapter when using software that has already been built by the system.

### 2.1 Load the Spack Environment

If you use `bash` or `zsh`, run the following after logging in.

```bash
$ . /shared/software/spack-1.2.0/share/spack/setup-env.sh
```

If you use `csh` or `tcsh`, run the following.

```csh
% source /shared/software/spack-1.2.0/share/spack/setup-env.csh
```

When using software in a batch job, include the same setup command in the job script.

### 2.2 Confirm That Spack Is Available

After loading the environment, run the following.

```bash
$ spack --version
$ which spack
```

If `spack: command not found` is displayed, the environment in 2.1 has not been loaded. In the same shell, load `setup-env.sh` again.

### 2.3 Check Available Software

Check the prebuilt software explicitly provided by the system.

```bash
$ spack find -x
```

To also display hashes, use the following.

```bash
$ spack find -lx
```

Common check commands are as follows.

| Command | Purpose |
|---|---|
| `spack find -x` | Shows only packages that are provided for direct user use. |
| `spack find -lx` | Shows the same packages as `spack find -x`, plus short hashes. |
| `spack find <name>` | Searches installed packages with the specified name. |
| `spack find -lv <name>` | Shows detailed information and hashes for the specified package. |
| `spack find --loaded` | Shows packages currently loaded in the shell. |

If you run `spack find` without `-x`, packages installed as dependencies are also shown. For normal use, start with `spack find -x`.

### 2.4 Load Software

For example, to use `cp2k`, run the following.

```bash
$ spack load cp2k
```

Loading a package sets environment variables such as `PATH`, making the application available in that shell or job.

Check that the executable is visible.

```bash
$ which <execution command>
```

For some applications, the package name and executable command name are different.
For example, Quantum ESPRESSO uses application-specific commands such as `pw.x`.
If you do not know the executable command, check the application's official manual or administrator guidance.

You can check currently loaded packages with the following.

```bash
$ spack find --loaded
```

### 2.5 Unload Software When Finished

To remove a package from the current shell after use, run the following.

```bash
$ spack unload cp2k
```

When trying another package with the same name but different build conditions, unload the old package before loading the new one.


## 3. Using Software in Batch Jobs

Do not run heavy computations on login nodes. Run actual computations on compute nodes through batch jobs or interactive jobs.

### 3.1 Basic GPU Job Form

When using GPU-enabled software, loading the software with Spack alone does not allocate GPUs. Request GPU resources in the Slurm job options.

```bash
#!/bin/bash
#SBATCH --job-name=gpu-app-test # Job name
#SBATCH --time=00:10:00         # Time limit
#SBATCH --gpus=8                # Number of GPUs
#SBATCH --ntasks=8              # Number of processes

. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load <GPU-enabled package name>

# Examples for checking that GPUs are allocated
srun nvidia-smi
srun bash -c 'echo CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES'

srun <application execution command> <input file, etc.>
```

### 3.2 Main GPU-Enabled Software Provided

The following software is currently provided as GPU-enabled builds.

- `petsc`
- `lammps`
- `quantum-espresso`
- `gromacs`
- `kokkos`

The provided software may be updated. Check the latest list with the following.

```bash
$ spack find -x
```

### 3.3 Example Quantum ESPRESSO Job Script

The following is an example using `quantum-espresso`.

```bash
#!/bin/bash
#SBATCH --job-name=qe-test # Job name
#SBATCH --time=00:30:00    # Time limit
#SBATCH --gpus=8           # Number of GPUs
#SBATCH --ntasks=8         # Number of processes

. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load quantum-espresso

srun pw.x -in qe.in
```

`qe.in` is a Quantum ESPRESSO input file. For actual calculations, prepare the input file and required pseudopotential files in UPF format in advance.

## 4. Using hpcx-mpi

NVIDIA HPC-X MPI is available on this system. HPC-X MPI is an MPI implementation based on Open MPI and uses communication libraries such as UCX.

However, not all MPI applications provided in the public instance are built with `hpcx-mpi` support. Before running an MPI application, confirm that the target application was built with an `hpcx-mpi` configuration.

### 4.1 Main Packages Provided with hpcx-mpi Support

The following applications and libraries are currently provided with `hpcx-mpi` support.

- `quantum-espresso`
- `gromacs`
- `openfoam-org`
- `darshan-runtime`

### 4.2 Check Whether a Package Supports hpcx-mpi

First, check the hash of the target package.

```bash
$ spack find -lv <package name>
```

Example:

```bash
$ spack find -lv quantum-espresso
```

After finding the hash, use it to check the build configuration.

```bash
$ spack spec /<hash>
```

If the dependency tree contains the following entry, that configuration uses `hpcx-mpi`.

```text
^hpcx-mpi
```

When multiple packages have the same name, checking only by package name, such as `spack spec quantum-espresso`, may show a configuration different from the installed package you intended. We recommend checking the hash with `spack find -lv <package name>` and then confirming the configuration with `spack spec /<hash>`.

### 4.3 MPI Runtime Considerations

MPI applications must use the same MPI implementation expected by the loaded application at runtime. When using MPI applications provided in this system's public instance, generally load the target application with `spack load` and run it with Slurm `srun`.

```bash
. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load <MPI-enabled package name>
srun <MPI application execution command> <input file, etc.>
```

If an MPI communication error occurs, see the troubleshooting section in Chapter 8.


## 5. Finding Provided Software

The provided software may be updated. Always check the latest list on the system.

```bash
$ spack find -x
```

### 5.1 Main Provided Software

| Field | Main packages |
|---|---|
| First-principles calculations and quantum chemistry | `cp2k`, `quantum-espresso`, `cpmd`, `openmx`, `salmon-tddft` |
| Molecular dynamics | `gromacs`, `lammps`, `genesis` |
| CAE, structural analysis, and fluid analysis | `frontistr`, `openfoam`, `openfoam-org` |
| Weather and geoscience | `wrf`, `scale` |
| Visualization, image processing, and video processing | `paraview`, `povray`, `gnuplot`, `grads`, `ffmpeg` |
| Python-related libraries | `py-scipy`, `py-pandas`, `py-matplotlib`, `py-scikit-learn`, `py-netcdf4`, `py-mpi4py`, `py-ase`, `py-xarray`, `py-toml` |
| Chemistry and drug discovery | `openbabel`, `autodock-vina` |
| Development and other tools | `julia`, `rust`, `gsl`, `tmux`, `darshan-runtime`, `kokkos`, `petsc`, `parallel-netcdf`, `netcdf-c`, `netcdf-fortran`|

### 5.2 Example Output of `spack find -lx`

The following is example output. Hashes, versions, and package counts may change when the system is updated.

```text
$ spack find -lx
-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=gcc@13.3.0 ----
g6hpeea cp2k@2026.1            qxqrq4o parallel-netcdf@1.14.1
gmcipc4 darshan-runtime@3.5.0  vephnns paraview@6.1.1
q6ezzfa frontistr@5.3          e7q773o petsc@3.25.2
dtkhf7f julia@1.12.6           kg4hkb6 py-scipy@1.17.1

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=nvhpc@26.3 ----
efwm4pc quantum-espresso@7.5

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx=gcc@13.3.0 ------------
icb2hpj ffmpeg@8.1       j25jgtt openfoam-org@12
g4gyqaz ffmpeg@8.1       snjqbss povray@3.7.0.10
kiylntv gnuplot@6.0.0    l2zajbr py-matplotlib@3.11.0
teveiql grads@2.2.3      wypy6fy py-mpi4py@4.1.1
b2zyy2l gromacs@2026.1   qpo72vu py-pandas@3.0.3
sjduy44 lammps@20260211  esjclj6 py-scikit-learn@1.9.0
dcheirs openbabel@3.2.0  usvgll2 rust@1.96.0
lrbixw3 openfoam@2512

-- linux-ubuntu24.04-neoverse_v2 / %c,fortran=gcc@13.3.0 --------
53j2h54 cpmd@4.3              t3je6ga salmon-tddft@2.0.0
djkxpao genesis@1.6.0         4hnwin4 scale@5.4.4
7phdib7 netcdf-fortran@4.6.2  vjefr4h wrf@4.7.1
6trnbya openmx@3.9

-- linux-ubuntu24.04-neoverse_v2 / %c=gcc@13.3.0 ----------------
hb4jb3t gsl@2.8         djy67le py-netcdf4@1.7.2
i7qisgo netcdf-c@4.9.2  fxzltob tmux@3.6a

-- linux-ubuntu24.04-neoverse_v2 / %cxx=gcc@13.3.0 --------------
y4boldd autodock-vina@1.2.6  kup5bkr kokkos@5.1.1

-- linux-ubuntu24.04-neoverse_v2 / no compilers -----------------
52c5kr6 py-ase@3.28.0   us4lyh6 py-xarray@2026.4.0
kn3r4xs py-toml@0.10.2
==> 40 installed packages
```


## 6. When Multiple Packages Have the Same Name

Spack can manage multiple builds of the same software at the same time, with different versions, compilers, MPI implementations, GPU support, dependencies, and other settings. For this reason, the same package name may appear more than once.

### 6.1 Typical Error

For example, suppose you run the following when multiple builds of `fftw` are installed.

```bash
$ spack load fftw
```

If there are multiple candidates, an error like the following is shown.

```text
==> Error: fftw matches multiple packages.
  Matching packages:
    erk4i5v fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    5rny4xu fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    nkvjfgj fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=nvhpc@26.3
```

### 6.2 Recommended: Specify by Hash

When multiple packages have the same name, first check the short hashes.

```bash
$ spack find -lx fftw
```

Then load the build you want by using its short hash.

```bash
$ spack load /5rny4xu
```

For the candidates in the example output, you can specify them as follows.

```bash
$ spack load /erk4i5v
$ spack load /5rny4xu
$ spack load /nkvjfgj
```

Hashes may change when the environment is updated. Do not memorize the hashes in this manual as fixed values. Check them at runtime with `spack find -lx <package name>`.

### 6.3 Specify by Version or Compiler

You can also specify a version number.

```bash
$ spack load fftw@3.3.11
```

However, if multiple builds have the same version, this alone cannot distinguish them. In that case, include the compiler.

```bash
$ spack load fftw%gcc
$ spack load fftw%nvhpc
```

For more detailed specification, write the compiler version as follows.

```bash
$ spack load fftw%gcc@13.3.0
$ spack load fftw%nvhpc@26.3
```

If multiple candidates still remain, specify the package by hash.


## 7. Using a Private Instance

This chapter is for users who want to build and use OSS themselves. If you only use prebuilt software provided by the public instance, you do not need to perform the steps in this chapter.

### 7.1 When a Private Instance Is Needed

Use a private instance in the following cases.

- You want to use OSS that is not in the public instance.
- You want to use a different version from the provided one.
- You want to build with custom build options, dependencies, or compiler settings.
- You want to manage custom packages within a research group.

### 7.2 Create a Spack Instance

The following example creates a personal Spack instance under your home directory.

```bash
$ cd $HOME
$ git clone <Spack repository URL> spack
$ cd spack
$ git checkout <branch name>
```

Follow administrator guidance for the repository URL and branch name to use.

### 7.3 Load the Private Instance Environment

```bash
$ . $HOME/spack/share/spack/setup-env.sh
```

If you load both the public instance and private instance `setup-env.sh` files in the same shell, it becomes difficult to tell which Spack is being used. When using a private instance, we recommend opening a new shell and loading the private-side `setup-env.sh`.

### 7.4 Configure Chaining with the Public Instance

In a private instance, you can refer to prebuilt packages in the public instance by configuring Spack's `upstreams.yaml`. This reduces the cost of building dependencies each time.

A standard configuration example is as follows.

```bash
$ mkdir -p ~/.spack
$ cat > ~/.spack/upstreams.yaml <<'EOF'
upstreams:
  gb200-public:
    install_tree: /shared/software/spack-1.2.0/opt/spack
EOF
```

The `install_tree` path depends on the actual public instance configuration. If administrators announce a different path, use that path.

After configuring it, check whether packages from the public instance are visible.

```bash
$ spack find -lx
```

### 7.5 Search for Packages

Search for package names available in Spack.

```bash
$ spack list
$ spack list mpi
```

Check package versions and build options.

```bash
$ spack info openmpi
```

### 7.6 Install Packages

For example, to install `openmpi`, run the following.

```bash
$ spack install openmpi
```

You can also specify a version.

```bash
$ spack install openmpi@4.1.1
```

After installation, check it with the following.

```bash
$ spack find -lx openmpi
```

!!! note

    Build packages for compute nodes from an interactive job on a compute node or by submitting an installation job. Do not run long builds on login nodes.

### 7.7 Uninstall Packages

```bash
$ spack uninstall openmpi
```

If multiple packages have the same name, prevent accidental deletion by checking the target by hash before running the uninstall command.

```bash
$ spack find -lx openmpi
$ spack uninstall /<hash>
```

!!! note

    Do not delete packages in the public instance. Delete only packages that you installed in your private instance.

## 8. Troubleshooting

| Symptom | Main cause | Action |
|---|---|---|
| `spack: command not found` is displayed | The Spack environment has not been loaded | Run `. /shared/software/spack-1.2.0/share/spack/setup-env.sh`. The same setup is required inside jobs. |
| `matches multiple packages` is displayed | Multiple packages have the same name | Check candidates with `spack find -lx <package name>` and load the package with `spack load /<hash>`. |
| The execution command is still not found after `spack load` | The executable name differs from the package name, or the package is a library package | Check the application's executable command name. Ask administrators if needed. |
| An MPI job does not start or has a communication error | The MPI implementation or build configuration does not match the runtime environment | Check whether the package has an `hpcx-mpi` configuration with `spack find -lv <package name>` and `spack spec /<hash>`. |
| Builds in a private instance are very slow | Dependencies are also being built from scratch | Configure chaining with the public instance and reuse existing prebuilt packages. |
| The application works in a login shell but not in a job script | The Spack environment is not loaded in the job script | Explicitly write the `setup-env.sh` load command and `spack load` command in the job script. |

### 8.1 Information to Check Before Contacting Support

When contacting administrators, include the following information if possible.

```bash
$ hostname
$ date
$ echo $SHELL
$ which spack
$ spack --version
$ spack find --loaded
$ spack find -lx <package name you want to use>
```

If the problem occurs in a job, also include the job ID, job script, standard output, and standard error.
