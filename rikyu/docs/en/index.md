# Welcome

This guide provides basic information for using the AI4S Supercomputer during early access, including login instructions and simple Slurm job examples.

For hardware information about this system, refer to [https://github.com/RIKEN-RCCS/AI-for-Science-Supercomputer](https://github.com/RIKEN-RCCS/AI-for-Science-Supercomputer){ target="_blank" rel="noopener" }.

To request an account for the AI4S Supercomputer early access program, submit the account registration form.

[Account registration form](https://forms.cloud.microsoft/r/M7ZdHajg9G){ .md-button .md-button--primary .registration-button target="_blank" rel="noopener" }

<div class="notice-warning" markdown>
Notice: Transition to Early Access Phase 2

Early Access Phase 1 (current system) will end in the morning of Monday, July 6, 2026 (JST). Early Access Phase 2 will begin in the afternoon of Tuesday, July 7, 2026 (JST), following a system maintenance window during which the system will be unavailable (afternoon of July 6 to afternoon of July 7).

Phase 1 account information will not be carried over. All users must reapply for an account on or after July 6. Project representatives must also submit a new project application before registering user accounts.

Note that usage charges will apply starting from Phase 2, unlike Phase 1. Further details on project and account applications, usage charges, and related procedures will be announced separately.
</div>

## SSH Login

Replace `USERNAME` below with your own username.

```bash
$ ssh USERNAME@login01.ai.r-ccs.riken.jp
```

## Usage

Submit jobs to the system using Slurm. The following partitions are available.

| Partition | Max Nodes | Max GPUs/Node | Max CPU Cores/Node | Max Memory/Node | Max Wall Time |
| --------- | --------: | ------------: | -----------------: | --------------- | ------------- |
| 1n1gpu    |         1 |             1 |                 36 | 400GB           | 96 hours      |
| 1n2gpu    |         1 |             2 |                 72 | 800GB           | 96 hours      |
| 1n4gpu    |         1 |             4 |                144 | 1600GB          | 96 hours      |
| 2n4gpu    |         2 |             4 |                144 | 1600GB          | 96 hours      |
| 4n4gpu    |         4 |             4 |                144 | 1600GB          | 96 hours      |
| 4n4gpu-p  |         4 |             4 |                144 | unlimited       | unlimited     |

### Module environment

The system provides several module environments for development and execution with the NVIDIA HPC Software Development Kit.

| Module | Description |
| ------ | ----------- |
| nvhpc | Standard NVHPC environment |
| nvhpc-nompi | NVHPC without MPI; use this when you manage MPI yourself |
| nvhpc-hpcx | NVHPC with IB and HPC-X |
| nvhpc-hpcx-cuda13 | NVHPC with HPC-X and CUDA 13 fixed |
| nvhpc-byo-compiler | Use the system GCC; BYO means bring your own |

#### List available modules

Use `module avail` to see the detailed list of available modules.

```bash
$ module avail
```

#### List loaded modules

Use `module list` to check which modules are currently loaded.

```bash
$ module list
```

#### Load a module

Use `module load` to load the environment you want to use.

```bash
$ module load nvhpc
```

#### Switch modules

Unload the current module before loading another one.

```bash
$ module unload nvhpc
$ module load nvhpc-hpcx
```

#### Inspect a module

Use `module show` to check what a module changes in your environment.

```bash
$ module show nvhpc-hpcx
```

### Submit a batch job

Create a job script such as `job.sh`. The following example requests one node and one GPU on the `1n1gpu` partition.

```bash
#!/bin/bash
#SBATCH --job-name=test-job
#SBATCH --partition=1n1gpu
#SBATCH --nodes=1
#SBATCH --gpus-per-node=1
#SBATCH --time=00:10:00

module load nvhpc

hostname
nvidia-smi
```

Submit the job with `sbatch`.

```bash
$ sbatch job.sh
```

Check your jobs with `squeue`.

```bash
$ squeue -u $USER
```

### Run an interactive job

#### With salloc

Use `salloc` to allocate resources for an interactive session. The following example requests one node and one GPU on the `1n1gpu` partition for 10 minutes.

```bash
$ salloc --partition=1n1gpu --nodes=1 --gpus-per-node=1 --time=00:10:00
```

After the allocation starts, use `srun` to run commands on the allocated node.

```bash
$ srun hostname
$ srun nvidia-smi
```

When you are finished, run `exit` to release the interactive allocation.

```bash
$ exit
exit
salloc: Relinquishing job allocation 1066
```

#### With srun

Use `srun --pty bash` to start an interactive shell on a compute node. The following example requests one node and one GPU on the `1n1gpu` partition for 10 minutes.

```bash
$ srun --partition=1n1gpu --nodes=1 --gpus-per-node=1 --time=00:10:00 --pty bash
```

When you are finished, run `exit` to leave the shell and end the `srun` job.

```bash
$ exit
exit
```

### Cancel a job

Cancel a submitted or running job with `scancel`. Replace `JOBID` with the job ID shown by `sbatch` or `squeue`.

```bash
$ scancel JOBID
```

### Check partition status

Use `sinfo` to check the status of partitions and nodes.

```bash
$ sinfo
```

To check a specific partition, use `-p`.

```bash
$ sinfo -p 1n1gpu
```

### Local scratch storage

Each compute node provides a local scratch area on an approximately 7TB NVMe
SSD. Use the `USER_SCRATCH_DIR` environment variable to access this scratch area
from your job.

This storage is useful when you need fast local SSD access for temporary files,
datasets, checkpoints, or intermediate results during computation. Files in this
area are automatically deleted after the job finishes, so copy any results that
you need to keep to your persistent storage before the job ends.

```bash
#!/bin/bash
#SBATCH --job-name=scratch-example
#SBATCH --partition=1n1gpu
#SBATCH --nodes=1
#SBATCH --gpus-per-node=1
#SBATCH --time=00:10:00

module load nvhpc

echo "Scratch directory: ${USER_SCRATCH_DIR}"

./my_application > ${USER_SCRATCH_DIR}/output.log

# Copy results that must be kept before the job finishes.
# SLURM_SUBMIT_DIR is the directory where you ran the sbatch command.
cp ${USER_SCRATCH_DIR}/output.log ${SLURM_SUBMIT_DIR}/
```

### MPI communication settings for multi-GPU / multi-node (tentative)

For applications that pass GPU buffers directly to MPI (CUDA-aware MPI / GPUDirect), the current software stack (HPC-X 2.25.1 / UCX 1.20) requires the settings below. Without them, inter-node GPU-to-GPU communication can become extremely slow or fail outright. These are **tentative recommended settings** until a permanent fix is in place.

```bash
module load nvhpc-hpcx

# (1) Environment variables to enable CUDA-aware MPI
export OMPI_MCA_pml=ucx
export UCX_CUDA_COPY_DMABUF=no
export UCX_MAX_RNDV_RAILS=4
export NCCL_DMABUF_ENABLE=0
export NCCL_NET_GDR_LEVEL=SYS

# (2) Required when using GPU-buffer communication across nodes.
#     Without this, inter-node non-blocking GPU communication
#     (MPI_Isend/Irecv, etc.) fails with
#     "cannot find remote protocol ... tag_send ... from cuda".
export UCX_PROTO_ENABLE=n

# Propagate each variable to mpirun with -x
X="-x OMPI_MCA_pml -x UCX_CUDA_COPY_DMABUF -x UCX_MAX_RNDV_RAILS -x NCCL_DMABUF_ENABLE -x NCCL_NET_GDR_LEVEL -x UCX_PROTO_ENABLE"
mpirun -n <ranks> --map-by ppr:4:node $X ./your_app
```

#### GPU assignment (one process = one GPU)

When using multiple GPUs on a node, assign each MPI process to a distinct GPU. Otherwise all processes share GPU 0, NVLink is not used, and performance drops sharply. Doing this in the application is ideal:

- C/CUDA: `cudaSetDevice(local_rank)`
- OpenACC (Fortran): `call acc_set_device_num(mod(local_rank, ndev), acc_get_device_type())`
- If you cannot modify the application, use a wrapper that sets `CUDA_VISIBLE_DEVICES` to the local rank:

```bash
cat > devwrap.sh <<'WRAP'
#!/bin/bash
export CUDA_VISIBLE_DEVICES=${OMPI_COMM_WORLD_LOCAL_RANK:-0}
exec "$@"
WRAP
chmod +x devwrap.sh
mpirun -n <ranks> --map-by ppr:4:node $X ./devwrap.sh ./your_app
```

These settings may become unnecessary with future stack updates.

## Contact

Please try the AI chat support — it can answer many common questions instantly.

[AI Chat Support](https://riken-rccs.github.io/ai4s_early_access/en/chat/){ .md-button .md-button--primary .chat-button target="_blank" rel="noopener" }

If your question is not resolved, contact the support team by email: `rccs-ai4s-support [at] ml.riken.jp`.
