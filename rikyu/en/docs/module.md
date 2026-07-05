# Module Environment

This system provides the following development environments as modules using the NVIDIA HPC Software Development Kit.

| Module name | Description |
| ----------- | ----------- |
| `nvhpc` | Standard NVIDIA HPC SDK environment including MPI. |
| `nvhpc-nompi` | NVIDIA HPC SDK environment without MPI. Suitable when you prepare and use another MPI yourself. |
| `nvhpc-hpcx` | Environment combining `nvhpc` with HPC-X. Suitable when using HPC-X MPI in an InfiniBand/RDMA environment. |
| `nvhpc-hpcx-cuda13` | Includes HPC-X like `nvhpc-hpcx`, but the CUDA version is fixed to CUDA 13. |
| `nvhpc-byo-compiler` | Environment for using a compiler prepared by the user, such as the system GCC. BYO stands for "Bring Your Own". |

## `module` Command

The `module` command lets you dynamically switch the required environment settings. The main `module` commands are as follows.

| Command | Description |
| ------- | ----------- |
| `module avail` | List available modules |
| `module list` | List loaded modules |
| `module load MODULE_NAME` | Load a module |
| `module unload MODULE_NAME` | Unload a module |
| `module purge` | Unload all modules |
| `module show MODULE_NAME` | Show module settings |

## Command Examples

### Listing Available Modules

```bash
$ module avail
------------------------ /shared/software/modulefiles ------------------------
   nvhpc-byo-compiler/26.3    nvhpc-hpcx-cuda13/26.3    nvhpc-hpcx/26.3
   nvhpc-nompi/26.3    nvhpc/26.3

------------------------ /usr/share/lmod/lmod/modulefiles --------------------
   Core/lmod    Core/settarg (D)

  Where:
   D:  Default Module

If the avail list is too long consider trying:

"module --default avail" or "ml -d av" to just list the default modules.
"module overview" or "ml ov" to display the number of modules for each name.

Use "module spider" to find all possible modules and extensions.
Use "module keyword key1 key2 ..." to search for all possible modules matching any of the "keys".
```

### Listing Loaded Modules

```bash
$ module list

Currently Loaded Modules:
  1) nvhpc/26.3
```

### Loading a Module

```bash
$ module load nvhpc
```

### Unloading a Module

```bash
$ module unload nvhpc
```

### Unloading All Modules

```bash
$ module purge
```

!!! tip

    Running `module purge` before loading the required modules helps avoid unintended effects from the module environment.

### Showing Module Settings

```bash
$ module show nvhpc
---------------------------------------------------
   /shared/software/modulefiles/nvhpc/26.3:
---------------------------------------------------
conflict("nvhpc")
conflict("nvhpc-nompi")
conflict("nvhpc-byo-compiler")
conflict("nvhpc-hpcx")
setenv("NVHPC","/shared/software/hpc_sdk")
setenv("NVHPC_ROOT","/shared/software/hpc_sdk/Linux_aarch64/26.3")
setenv("CC","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin/nvc")
setenv("CXX","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin/nvc++")
setenv("FC","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin/nvfortran")
setenv("F90","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin/nvfortran")
setenv("F77","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin/nvfortran")
setenv("CPP","cpp")
prepend_path("PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/cuda/bin")
prepend_path("PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/bin")
prepend_path("PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/mpi/bin")
prepend_path("PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/extras/qd/bin")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/cuda/lib64")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/extras/qd/lib")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/lib")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/math_libs/lib64")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nccl/lib")
prepend_path("LD_LIBRARY_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nvshmem/lib")
prepend_path("CPATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/math_libs/include")
prepend_path("CPATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nccl/include")
prepend_path("CPATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nvshmem/include")
prepend_path("CPATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/extras/qd/include/qd")
prepend_path("C_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/math_libs/include")
prepend_path("C_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nccl/include")
prepend_path("C_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nvshmem/include")
prepend_path("C_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/extras/qd/include/qd")
prepend_path("CPLUS_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/math_libs/include")
prepend_path("CPLUS_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nccl/include")
prepend_path("CPLUS_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/comm_libs/nvshmem/include")
prepend_path("CPLUS_INCLUDE_PATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/extras/qd/include/qd")
prepend_path("MANPATH","/shared/software/hpc_sdk/Linux_aarch64/26.3/compilers/man")
setenv("OMPI_MCA_coll_hcoll_enable","0")
setenv("OMPI_MCA_hwloc_base_binding_policy","none")
```
