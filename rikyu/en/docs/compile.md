# Compiling Programs

## Overview

This page explains how to compile programs using GCC and the NVIDIA HPC SDK (NVHPC).

## Available Compilers

### GCC (GNU Compiler Collection)

GCC is an open source compiler widely used in Linux environments. It supports C, C++, and Fortran, and can be used as the compiler for CPU application development. Use GCC to build general numerical programs and open source software. It can also be used for shared memory parallelization with OpenMP and for CPU parallel program development in combination with an MPI environment.

Available compilers:

| Language | Command |
|----------|---------|
| C | `gcc` |
| C++ | `g++` |
| Fortran | `gfortran` |

Checking the version:

```bash
gcc --version
g++ --version
gfortran --version
```

### NVIDIA HPC SDK (NVHPC)

NVHPC is a set of compilers and related tools for high performance computing provided by NVIDIA. Use it for GPU programming with OpenACC or CUDA, and for developing applications that use GPU libraries.

Available compilers:

| Language | Command |
|----------|---------|
| C | `nvc` |
| C++ | `nvc++` |
| Fortran | `nvfortran` |

Checking the version:

```bash
module load nvhpc
nvc --version
nvc++ --version
nvfortran --version
```

## Compiling

Compiling is the process of generating an executable program from source code. The basic development steps are as follows.

1. Write the source code
2. Run the compiler
3. Check errors and warnings
4. Generate the executable
5. Check the execution results

### Compiling with GCC

#### C

```bash
gcc sample.c -o sample
```

#### C++

In C++, the default language standard may differ depending on the compiler and library versions. To improve portability, we recommend specifying the language standard explicitly with the `-std` option.

```bash
g++ -std=c++17 sample.cpp -o sample
```

#### Fortran

As with C++, we recommend specifying the language standard explicitly with the `-std` option.

```bash
gfortran -std=f2008 sample.f90 -o sample
```

### Compiling with NVHPC

To use NVHPC, set up the environment in advance with the `module load nvhpc` command.

#### C

```bash
module load nvhpc
nvc sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran sample.f90 -o sample
```

### Basic Compiler Options

#### Specifying the Output File

Specify the output file name with the `-o` option. If the `-o` option is omitted, the executable is named `a.out`.

```bash
gcc sample.c -o myprogram
```

#### Specifying Include Paths

If the header files of a library you use are located outside the standard paths, add the search directories with the `-I` option.

```bash
gcc -I/path/to/include1 -I/path/to/include2 sample.c -o sample
```

#### Linking Libraries

Compiling and linking are separate steps. Even if compilation succeeds, an `undefined reference` error occurs when the corresponding library is not linked. To link an external library, specify the library directory with the `-L` option and the library name with the `-l` option.

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

## Optimization Options

Specifying the compiler optimization level can improve execution speed. Optimization options control the transformations that the compiler performs to improve the execution efficiency of a program.

| Option | Description | Purpose |
|--------|-------------|---------|
| `-O0` | No optimization | For debugging. Compiles quickly |
| `-O1` | Basic optimization | Balance between debugging and execution speed |
| `-O2` | Standard optimization (**recommended**) | Suitable in most cases |
| `-O3` | Aggressive optimization | For maximum speed. Compilation takes longer |
| `-Ofast` | Most aggressive optimization | For maximum speed. Be careful about accuracy |

For general use, we recommend `-O2`. Use `-O3` or `-Ofast` when performance is a priority.

!!! note

    During development, we recommend enabling debugging information (`-g`) and warnings (`-Wall`), confirming that there are no problems, and only then applying optimization options. The `-g` option embeds debugging information, which is used when analyzing a program with a debugger such as gdb. The `-Wall` option enables common warnings. Even if compilation succeeds, warnings may indicate latent problems in your code, so please review them.

!!! note

    The higher the optimization level, the harder debugging becomes. When investigating a problem, we recommend using `-O0` or `-O1`.

!!! note

    Programs optimized with `-O3` or `-Ofast` may produce different computational results, especially in floating point calculations.

## Parallelization

### Shared Memory Parallelization with OpenMP

OpenMP provides shared memory parallelization using multiple CPU cores within a single node.

#### GCC

Specify the `-fopenmp` option at compile time. Specify the number of threads to use at run time with the `OMP_NUM_THREADS` environment variable.

```bash
gcc -fopenmp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

#### NVHPC

Use the `-mp` option at compile time. Specify the number of threads to use at run time with the `OMP_NUM_THREADS` environment variable.

```bash
module load nvhpc
nvc -mp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

### Distributed Memory Parallelization with MPI

MPI provides interprocess communication across multiple compute nodes. Running `module load nvhpc` makes available the Open MPI based MPI environment bundled with NVHPC.

To compile an MPI program, do not invoke `gcc`, `g++`, `gfortran` or `nvc`, `nvc++`, `nvfortran` directly. Instead, use the MPI wrapper compilers `mpicc`, `mpic++`, and `mpifort`. These wrappers automatically add the include paths and link options for the MPI library, and then invoke an NVHPC compiler (such as `nvc`) internally.

To run a compiled MPI program, use the `mpirun` command. Here, `-np 4` specifies execution with 4 processes.

```bash
module load nvhpc
mpicc sample.c -o sample          # C
mpic++ sample.cpp -o sample       # C++
mpifort sample.f90 -o sample      # Fortran
mpirun -np 4 ./sample
```

You can check which compiler and options a wrapper compiler uses internally with the `--show` option.

```bash
mpicc --show
mpic++ --show
mpifort --show
```

### Hybrid Parallelization with MPI and OpenMP

To use the CPU cores of multiple nodes efficiently, hybrid parallelization combining MPI and OpenMP is effective. Because the wrapper compilers invoke an NVHPC compiler internally, specify `-mp` to enable OpenMP, the same option as for NVHPC above.

```bash
module load nvhpc
mpicc -mp hybrid_sample.c -o hybrid_sample
export OMP_NUM_THREADS=2
mpirun -np 4 ./hybrid_sample
```

This example starts 4 processes, each running with 2 threads.

## GPU Development

### Checking the GPU Environment

```bash
module load nvhpc
nvcc --version
nvidia-smi
nvidia-smi -L
nvidia-smi -q
```

| Command | Description |
|---------|-------------|
| `nvcc --version` | Shows the version of the CUDA compiler. |
| `nvidia-smi` | Shows GPU utilization, memory usage, and driver information. |
| `nvidia-smi -L` | Lists the GPUs recognized by the system. |
| `nvidia-smi -q` | Shows detailed GPU information such as temperature, clocks, and ECC status. |

### GPU Programming with OpenACC

OpenACC is a directive based programming model for offloading C/C++ and Fortran programs to GPUs. Unlike CUDA, it does not require you to explicitly implement GPU processing and memory management; you can use the GPU by adding directives to your source code.

The advantages of OpenACC are as follows.

- Easy to port existing code to the GPU
- Requires few source code modifications
- Relatively low learning cost

The advantages of CUDA are as follows.

- Allows detailed use of GPU specific features
- Allows finer performance tuning

On the other hand, CUDA requires you to write GPU processing explicitly, so the implementation and maintenance burden is greater.

If you want to tune performance or make the most of GPU specific features, CUDA is also an option. For many scientific computing codes, however, we recommend starting with GPU porting using OpenACC.

### Compiling OpenACC Programs

To use OpenACC, specify the `-acc` option.

#### C

```bash
module load nvhpc
nvc -acc sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ -acc sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran -acc sample.f90 -o sample
```

The `-Minfo=accel` option lets you check which parts were offloaded to the GPU when compiling with OpenACC.

```bash
nvc -acc -Minfo=accel sample.c -o sample
```

Example output:

```text
main:
      4, Generating implicit firstprivate(n,i)
         Generating NVIDIA GPU code
          6, #pragma acc loop gang, vector(128) /* blockIdx.x threadIdx.x */
      4, Generating implicit copyin(a[:1000]) [if not already present]
         Generating implicit copyout(c[:1000]) [if not already present]
         Generating implicit copyin(b[:1000]) [if not already present]
```

### Combining MPI and OpenACC

Combining MPI and OpenACC lets you run parallel computations that use multiple nodes and multiple GPUs. MPI handles communication between nodes, and OpenACC performs the computation on the GPU assigned to each MPI process.

#### C

```bash
module load nvhpc
mpicc -acc sample.c -o sample
mpirun -np 4 ./sample
```

#### C++

```bash
module load nvhpc
mpic++ -acc sample.cpp -o sample
mpirun -np 4 ./sample
```

#### Fortran

```bash
module load nvhpc
mpifort -acc sample.f90 -o sample
mpirun -np 4 ./sample
```

!!! note

    In applications that combine MPI processes with GPUs, a configuration that assigns one MPI process per GPU is commonly used.

### Compiling with CUDA

To use CUDA related features, you need the CUDA compiler and libraries. With NVHPC, you can enable CUDA features by specifying the `-cuda` option.

#### C

```bash
module load nvhpc
nvc -cuda sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ -cuda sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran -cuda sample.f90 -o sample
```

#### Specifying the Compute Capability

Specify the generation of the GPU code to be generated with the `-gpu=ccXX` option. The GPUs installed in this system are NVIDIA GB200 (Grace-Blackwell), whose Compute Capability is 10.0. The value to specify is therefore `cc100`.

```bash
nvc -cuda -gpu=cc100 sample.c -o sample
```

If the `-gpu` option is omitted, code is generated for the GPU of the node where the compilation is performed. On this system, both the login nodes and the compute nodes are equipped with GB200, so code for `cc100` is normally generated even when the option is omitted.

You can check the Compute Capability of the installed GPUs in the `Default Target` field of the `nvaccelinfo` command.

```bash
module load nvhpc
nvaccelinfo | grep "Default Target"
```

!!! note

    The Compute Capability is a value that depends on the GPU generation. When building for an environment other than this system, specify the value for the target environment explicitly with `-gpu=ccXX`. For details, see the NVIDIA HPC SDK documentation.

### Combining MPI and CUDA

Combining MPI and CUDA lets you run large scale parallel computations that use multiple nodes and multiple GPUs. Specify the `-cuda` option for the wrapper compilers as well.

#### C

```bash
module load nvhpc
mpicc -cuda sample.c -o sample
mpirun -np 4 ./sample
```

#### C++

```bash
module load nvhpc
mpic++ -cuda sample.cpp -o sample
mpirun -np 4 ./sample
```

#### Fortran

```bash
module load nvhpc
mpifort -cuda sample.f90 -o sample
mpirun -np 4 ./sample
```

!!! note

    In applications that combine MPI processes with GPUs, a configuration that assigns one MPI process per GPU is commonly used.

### Using GPU Libraries

NVHPC integrates high performance libraries for GPUs.

| Library | Description |
|---------|-------------|
| cuBLAS | Basic linear algebra operations |
| cuFFT | Fast Fourier transforms |
| cuSPARSE | Sparse matrix operations |

An example of linking a library when compiling with CUDA is shown below.

```bash
module load nvhpc
nvc -cuda -lcublas sample.c -o sample
```

## Troubleshooting

### nvc Is Not Found

**Symptom:** `nvc: command not found`

**Cause:** The NVHPC module is not loaded.

**Solution:**

```bash
module load nvhpc
which nvc
```

Confirm that `module load` sets the environment variables.

### Link Error for Math Functions

**Symptom:** `undefined reference to 'pow'`

**Cause:** The math library is not linked.

**Solution:**

```bash
gcc sample.c -lm -o sample
```

Link the math library explicitly with the `-lm` option.

### Link Error for External Libraries

**Symptom:** `undefined reference to 'myfunction'`

**Cause:** The external library is not linked, or the library search path is not specified.

**Solution:**

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

Specify the library directory with the `-L` option and the library name with the `-l` option.

## Environment Variable Settings

Builds that use `configure` or `make` obtain the compiler and options to use from environment variables. Setting them in advance removes the need to specify the compiler for every build.

| Environment variable | Purpose |
|----------------------|---------|
| `CC` | C compiler |
| `CXX` | C++ compiler |
| `FC` | Fortran compiler |
| `CFLAGS` | Options for C compilation |

If you write these in `.bashrc` or `.bash_profile`, they are set automatically in new shell sessions.

```bash
# Add to ~/.bashrc
export CC=gcc
export CXX=g++
export FC=gfortran
export CFLAGS="-O2 -Wall"
```

When using NVHPC, configure them as follows.

```bash
module load nvhpc
export CC=nvc
export CXX=nvc++
export FC=nvfortran
export CFLAGS="-O2"
```
