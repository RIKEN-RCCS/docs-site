# モジュール環境

本システムでは、NVIDIA HPC Software Development Kitを利用した次の開発環境をモジュールとして提供しています。

| モジュール名   | 説明                                     |
| -------------- | ---------------------------------------- |
| `nvhpc`        | MPIを含む標準的なNVIDIA HPC SDK環境です。|
| `nvhpc-nompi`  | MPIを含まないNVIDIA HPC SDK環境です。別のMPIを自分で用意して使用する場合に使います。 |
| `nvhpc-hpcx`   | `nvhpc`にHPC-Xを組み合わせた環境です。InfiniBand/RDMA環境でHPC-XのMPIを使う場合に適しています。 |
| `nvhpc-hpcx-cuda13` | `nvhpc-hpcx`と同様にHPC-Xを含みますが、使用するCUDAバージョンがCUDA 13に固定されています。|
| `nvhpc-byo-compiler` | システムのGCCなど、利用者が用意したコンパイラを使うための環境です。BYOは“Bring Your Own”の略です。|

## `module`コマンド
`module`コマンドにより、必要な環境設定を動的に切り替えて利用できます。主な`module`コマンドは次のとおりです。

| コマンド | 説明 |
| -------- | ---- |
| `module avail`           | 利用可能なモジュールの一覧表示 |
| `module list`            | ロード済みのモジュールの一覧表示 |
| `module load [module]`   | `[module]`をロード |
| `module unload [module]` | `[module]`をアンロード |
| `module purge`           | 全てのモジュールをアンロード |
| `module show [module]`   | `[module]`の設定内容を表示 |

## コマンドの使用例
### `module avail`

利用可能なモジュールの一覧を表示します。

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

### `module list`

ロード済みのモジュールの一覧を表示します。

```bash
$ module list

Currently Loaded Modules:
  1) nvhpc/26.3
```

### `module load`

利用したいモジュールをロードします。

```bash
$ module load nvhpc
```

### `module unload`

ロード済のモジュールをアンロードします。

```bash
$ module unload nvhpc
```

### `module purge`

現在ロード済みの全てのモジュールをアンロードします。

```bash
$ module purge
```

!!! tip
    
    必要なモジュールをロードする前に`module purge`を実行しておくと、意図しないモジュール環境の影響を避けやすくなります。

### `module show`

モジュールの設定内容を表示します。

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
