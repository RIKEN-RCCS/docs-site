# Slurm

!!! warning

    Job scripts used in Early Access Phase 1 differ from the current environment, for example in their environment variables. Users who are still using scripts carried over from Early Access Phase 1 may experience unexpected behavior or other adverse effects, so we recommend recreating your job scripts.

To run programs on this system, submit jobs using the [Slurm job scheduler](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }. There are two ways to run jobs: <span class="text-marker">batch jobs</span> and <span class="text-marker">interactive jobs</span>. Batch jobs are submitted by creating a job script in advance and are suitable for long-running jobs. Interactive jobs let users run commands interactively and are suitable for debugging before submitting batch jobs.

This page explains how to submit jobs from the command line.

For the available GPU counts, CPU cores, and memory amounts for jobs, see [Job Resources](resources.md).

## Job Script Examples

### Serial Job

This is an example job script for a serial job, meaning a job that is not parallelized with MPI or OpenMP. The number of GPUs specified by `--gpus=` is available to the job.

```bash
#!/bin/bash
#SBATCH --job-name=test-job # Job name
#SBATCH --time=00:10:00     # Time limit
#SBATCH --gpus=2            # Number of GPUs

module load nvhpc           # Load module
./a.out                     # Execution command
```

### Parallel Job

This is an example job script for a parallel job. Specify the number of processes (`--ntasks=`) and the number of threads (`export OMP_NUM_THREADS=`) as needed.

```bash
#!/bin/bash
#SBATCH --job-name=test-job  # Job name
#SBATCH --time=00:10:00      # Time limit
#SBATCH --gpus=8             # Number of GPUs
#SBATCH --ntasks=32          # Number of processes
export OMP_NUM_THREADS=1     # Number of threads

module load nvhpc            # Load module
mpiexec ./a.out              # Execution command
```

## Slurm Commands

Slurm lets you submit jobs, check job status, and cancel jobs. The main Slurm commands are as follows.

| Command | Description |
| ------- | ----------- |
| `sbatch JOB_SCRIPT` | Submit a batch job |
| `squeue` | Show job status |
| `salloc` | Allocate compute resources for an interactive job |
| `srun` | Run an interactive job |
| `scancel JOB_ID` | Cancel a job |
| `sinfo` | Show compute node status |

!!! note
    For details on each Slurm command, see the following URL.
    https://slurm.schedmd.com/documentation.html

### Submitting a Batch Job

Create a job script (`job.sh`) and run the `sbatch` command on a login node.

```bash
$ sbatch job.sh
Submitted batch job 2080
```

The `2080` in the output message is the job ID. Use it to specify the target job when checking job status, canceling a job, and so on.

If you belong to multiple projects, you can specify the project to charge for the job with the Slurm `--account=` or `-A` option. In a job script, write it as follows. Specify the project name to use for `PROJECT_NAME`.

```bash
#SBATCH --account=PROJECT_NAME
```

Alternatively, specify it when running the `sbatch` command.

```bash
$ sbatch --account=PROJECT_NAME job.sh
```

### Showing Job Status

```bash
$ squeue
   JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    2080       gpu test-job rku00011  R       0:05      1 c072
```

### Allocating Compute Resources for an Interactive Job

Allocate compute resources for an interactive job with the `salloc` command. The following example requests 2 GPUs for 10 minutes. The `2081` in the output message is the job ID.

```bash
$ salloc --gpus=2 --time=00:10:00
salloc: Granted job allocation 2081
salloc: Waiting for resource configuration
salloc: Nodes c072 are ready for job
```

After the allocation starts, use the `srun` command to run a command on the allocated node.

```bash
$ srun hostname
c072
```

When you are finished, run `exit` to release the allocation.

```bash
$ exit
exit
salloc: Relinquishing job allocation 2081
```

### Running an Interactive Job

Start an interactive job with the `srun --pty bash` command. The following example requests 4 GPUs for 10 minutes.

```bash
$ srun --gpus=4 --time=00:10:00 --pty bash
$ hostname
c072
```

If you belong to multiple projects, you can specify the project to charge for the job with the Slurm `--account=` or `-A` option. Specify the project name to use for `PROJECT_NAME`.

```bash
$ srun --account=PROJECT_NAME --gpus=4 --time=00:10:00 --pty bash
```

When you are finished, run `exit` to leave the shell and end the `srun` job.

```bash
$ exit
exit
```

### Canceling a Job

Specify the job ID and cancel a submitted or running job with the `scancel` command.

```bash
$ scancel 2081
```

### Checking Compute Node Status

Check compute node status with `sinfo`.

```bash
$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 4-00:00:00    400   idle c[000-399]
```
