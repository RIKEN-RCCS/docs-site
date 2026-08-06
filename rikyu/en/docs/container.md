# Containers

## Introduction { #introduction }

This page explains how to use the container platform Apptainer.

!!! note

    The command examples on this page use the following placeholders. Replace them with the values for your own environment.
    
    | Notation | Meaning |
    |---|---|
    | `<username>` | Your login user name |
    | `<project-ID>` | The ID of your project (in the form rkpXXXXX, for example `rkp00010`) |
    | `<group>` | The name of the group you belong to (the directory name of the group area `/data1/<group>`) |
    
    Other text enclosed in `< >` (for example `<name>`, `<compute-node>`) should also be read according to the context.

### What Is a Container { #container }

A container is a form of virtualization that shares the host kernel while switching only the user environment below the root directory, so that applications run in a dedicated environment.

Containers offer the following advantages.

1. Because the kernel is already running and is shared, startup is fast and overhead is low
2. The OS environment, applications, and settings can be packaged together, giving high reproducibility
3. An image created once can be reused on multiple systems, reducing the effort of building and validating environments

They also have the following limitations.

- Containers do not emulate hardware, so an image for a different CPU architecture (aarch64 / x86_64 and so on) will not run
- The host kernel is used, so take care with features that depend on the kernel version or on drivers

### Container Images { #container-image }

A container image is an OS environment, runtime, and applications, separate from the host, built as a file system and saved to a file.

Apptainer uses a single-file format called SIF (Singularity Image Format). A complete runtime environment can be held as one file, which makes it easy to store and transfer. You can also fetch container images distributed in other formats, such as those on Docker Hub, and convert them to SIF or run them directly.

### Execution { #execution }

Apptainer integrates starting the container with starting the application, so an application inside a container can be run as if it were a single statically linked binary.

There are four main ways to run a container.

1. Start a shell when the container starts and work interactively (`apptainer shell`)
2. Run an arbitrary command in the image at the same time as the container starts (`apptainer exec`)
3. Run the command preconfigured in the image (`apptainer run` / running the SIF directly)
4. Start only the container and send commands to it from outside (`apptainer instance`)

Batch jobs normally use 2 and 3. Option 4 is suitable when processing many pieces of data repeatedly, or when keeping a service such as a Jupyter Notebook running.

## Getting Started { #getting-started }

This section explains the basic flow from fetching an existing image to starting a container. There are three ways to obtain or create an image.

1. Fetch and reuse an existing image published on Docker Hub or a similar registry
2. Expand an image onto the file system (as a sandbox) and modify it by hand
3. Write a definition file and automate the build

Working by hand (2) is convenient for debugging, but for reproducibility we recommend managing a definition file (3) in a repository and building from it. For base images, we assume the use of Ubuntu, AlmaLinux, Red Hat Universal Base Image (UBI), and others distributed on Docker Hub.

!!! note

    Both the login nodes and the compute nodes of this system use the aarch64 architecture. You can fetch, create, and run images without worrying about an architecture mismatch, but the images you fetch must be the arm64 (aarch64) build; images for x86_64 (amd64) will not run. When you `pull` or `build` on this system, the arm64 build is selected automatically, but some images do not provide an arm64 build.

### Creating Images from the Command Line { #build-image-cli }

To fetch an image from a public repository, use the `pull` command. Specify the image name and tag after `docker://`. Fetching from this system goes through an internal registry mirror (zot), and images from docker.io (Docker Hub), nvcr.io (NVIDIA NGC), and quay.io are available.

```console
apptainer pull ubuntu2404.sif docker://ubuntu:24.04
apptainer pull alma9.sif docker://almalinux:9
apptainer pull cuda13-base.sif docker://nvcr.io/nvidia/cuda:13.0.0-base-ubuntu24.04
apptainer pull busybox.sif docker://quay.io/prometheus/busybox:latest
```

When an image is fetched, Docker-format image layers are converted to the SIF format, and the layer data is cached under `~/.apptainer/cache`. A SIF image is a SquashFS file system and becomes read-only once started. To add applications to an image, use a build from a definition file as described below, or use a sandbox, which expands the image onto the file system.

A sandbox is created by adding the `--sandbox` option to the `build` command.

```console
apptainer build --sandbox ubuntu2404 docker://ubuntu:24.04
```

You own the files inside a sandbox, so you can edit them directly without starting the container. Note, however, that a container started from a sandbox is also read-only by default. To start it in a writable state, specify the `--writable` option (this cannot be used with a SIF image). In addition, the `--fakeroot` option is required to use package management commands such as `apt`, `dnf`, and `rpm`, which assume root privileges.

!!! note

    Outbound HTTP connections from this system are restricted, so fetching packages from outside with `apt` and similar tools may fail.

SIF and sandbox formats can be converted to each other.

```console
apptainer build from_sandbox.sif ubuntu2404
apptainer build --sandbox from_sif ubuntu2404.sif
```

You can check the architecture of a SIF image you have with the `sif list` command.

```console
apptainer sif list sample.sif
```

Example output:

```text
------------------------------------------------------------------------------
ID   |GROUP   |LINK    |SIF POSITION (start-end)  |TYPE
------------------------------------------------------------------------------
1    |1       |NONE    |32176-32214               |Def.FILE
2    |1       |NONE    |32214-36205               |JSON.Generic
3    |1       |NONE    |36205-36438               |JSON.Generic
4    |1       |NONE    |36864-28946432            |FS (Squashfs/*System/arm64)
```

The architecture is shown in the TYPE column, as in `FS (Squashfs/*System/arm64)`. If it is `arm64`, the image runs on this system.

### Starting a Container from an Image { #run-container }

The `shell` command starts a container and lets you work interactively in a shell. As an example of a distribution different from the host, the following starts the AlmaLinux image fetched in [Creating Images from the Command Line](#build-image-cli).

```console
apptainer shell alma9.sif
Apptainer> cat /etc/os-release
NAME="AlmaLinux"
VERSION="9.8 (Olive Jaguar)"
...
```

The host OS is Ubuntu, but inside the container the OS environment switches to that of the image (AlmaLinux in this example), and only the commands and libraries in the image are available. The kernel and the user are those of the host.

Your own home directory is visible from inside the container (the home directories of other users are not). Only your own entry is added to `/etc/passwd` in the container at startup. The process space is also shared with the host, so `ps` and `kill` work in both directions between the inside and the outside of the container.

The `exec` command runs an arbitrary command at the same time as the container starts.

```console
apptainer exec ubuntu2404.sif cat /etc/os-release
```

A SIF file has the execute permission set, so it can also be started directly like a script.

```console
./ubuntu2404.sif                      # Starts the shell in the image, or %runscript
./ubuntu2404.sif cat /etc/os-release
```

!!! note
    
    When you want to keep the contents of an image fixed, or to minimize startup overhead, we recommend using a SIF image. A SIF is compressed internally, so it is small relative to the total amount of files it holds and puts little load on metadata access, which makes application startup fast and stable.

## Building Images { #building-images }

This section explains how to create the SIF images you run.

### Using a Sandbox { #sandbox }

This approach edits a sandbox and then freezes it into a SIF. It is convenient, but no record of the work is kept, so we recommend saving a finalized procedure in a definition file.

If you do not need to start the container, you can simply expand a prebuilt application or reference data into the sandbox and freeze it.

```console
apptainer build --sandbox ubi9_py312 docker://registry.access.redhat.com/ubi9/python-312
tar xvzf ~/application.tar.gz -C ubi9_py312
vi ubi9_py312/usr/local/etc/application.config
apptainer build appl.sif ubi9_py312
```

To change the system by starting the container, for example to add packages, edit the sandbox with `--writable` and `--fakeroot`.

```console
apptainer build --sandbox /tmp/ubuntu-sandbox ubuntu2404.sif
apptainer shell --fakeroot --writable /tmp/ubuntu-sandbox
Apptainer> apt-get update
Apptainer> apt-get install -y XXXXXXX
Apptainer> exit
apptainer build ~/from-sandbox.sif /tmp/ubuntu-sandbox
```

!!! note

    A sandbox consists of a large number of small files, so placing it on a shared file system (the home or group area) puts a heavy load on metadata access. We recommend creating and editing sandboxes in the scratch area (`/tmp`). The scratch area is deleted when the job ends, so save the finished SIF image in the home or group area.

### Custom Images with a Definition File { #definition-file }

Writing a definition file lets you automate an image build and make it reproducible. A definition file consists mainly of the following elements.

1. Header (`Bootstrap:`, `From:`): specifies the base image
2. `%files`: files taken from the host into the image
3. `%post`: build steps run inside the image (adding packages and so on)
4. `%environment` / `%runscript`: environment variables and the default command at run time
5. `%labels`: metadata

The following definition file `example.def` adds packages and data on top of Ubuntu 24.04.

```text
Bootstrap: docker
From: ubuntu:24.04

%files
    some_data.tar.gz /

%post
    apt-get update
    apt-get install -y python3 python3-lxml
    tar xzf /some_data.tar.gz -C /usr/share
    rm /some_data.tar.gz
    apt-get clean

%environment
    export LC_ALL=C.UTF-8

%runscript
    python3 "$@"

%labels
    Author <username>@example.org
```

Build by adding `--fakeroot` to the `build` command.

```console
apptainer build --fakeroot ~/from_def.sif example.def
```

!!! note

    By default, the temporary expansion directory used during a build is the scratch area (`/tmp`). To specify the temporary area explicitly, use the `APPTAINER_TMPDIR` environment variable for the expansion directory and `APPTAINER_CACHEDIR` for the cache directory. If you do not want to consume space in your home area, pointing `APPTAINER_CACHEDIR` at the scratch area or the group area (`/data1/<group>`) is also effective.

### Embedding the Runtime Environment { #embed-runtime-env }

If you write the run command in `%runscript` in the definition file, you can start the application simply by running the SIF image directly. In the `example.def` shown in [Custom Images with a Definition File](#definition-file), `%runscript` is set to `python3 "$@"`, so it can be used as follows.

```console
./from_def.sif hoge.py 1024      # Runs python3 hoge.py 1024 inside the container
```

Embedding environment variables in `%environment` prevents missing settings and also simplifies job scripts (see [Embedding the Run Command in the Image](#slurm-embedded-runscript)).

!!! note

    If you specify the `latest` tag in `From:` in a definition file, what is fetched may change from build to build. When reproducibility matters, specify a tag pinned to a version.

### Building Images by Submitting a Job { #build-via-job }

A lightweight image can be built directly on a login node, but a large build that installs many packages puts a heavy load on CPU, memory, and storage, so we recommend running it on a compute node as a batch job. Temporary files created during a build consist of a large number of small files and put a load on the shared file system, so use the scratch area (`/tmp`) as the working area and copy only the result to the home or group area.

The following is an example job script (for how to request resources, see [Working with Slurm](#slurm)).

```bash
#!/bin/bash
#SBATCH -A <project-ID>
#SBATCH --time=01:00:00

# Build with the scratch area (/tmp, deleted when the job ends) as the working
# area, and save only the result to the home area (or the group area if large)
export APPTAINER_TMPDIR=/tmp/build
mkdir -p $APPTAINER_TMPDIR
apptainer build --fakeroot $APPTAINER_TMPDIR/create_job.sif ~/example.def
cp $APPTAINER_TMPDIR/create_job.sif ~/
```

```console
sbatch ./build_job.sh
```

### Managing Images with Digital Signatures { #image-signing }

Apptainer can sign and verify images with public key cryptography, letting you confirm who created an image and whether it has been tampered with.

Creating a key pair:

```console
apptainer key newpair
```

You are prompted interactively for a name, email address, comment, and passphrase. The keys are saved under `~/.apptainer` and can be listed with the following commands.

```console
apptainer key list           # List public keys
apptainer key list --secret  # List private keys
```

Signing and verifying:

```console
apptainer sign ubuntu2404.sif     # Enter the passphrase to sign
apptainer verify ubuntu2404.sif   # Show the signer, fingerprint, and result
```

Verification with `verify` requires the signer's public key. Running `verify` on an unsigned image fails with a "signature not found" error, as follows.

```console
apptainer verify unsigned.sif
```

Example output:

```text
INFO:    Verifying image with PGP key material
WARNING: No default remote in use, falling back to default keyserver: https://keys.openpgp.org
FATAL:   Failed to verify container: integrity: signature not found for object group 1
```

!!! note

    As the output above shows, when the matching public key is not available locally, an external key server (keys.openpgp.org) is consulted by default.

Exporting and importing a public key:

```console
apptainer key export ./public.asc
apptainer key import ./public.asc
```

Because an image can carry more than one signature, workflows such as multi-stage approval by an author and an administrator are also possible.

## Runtime Options and Behavior { #runtime-options }

### Inheriting the Host Environment { #host-environment }

#### Environment Variables { #env-vars }

At container startup, Apptainer passes almost all of the host environment variables into the container. `PATH` and `LD_LIBRARY_PATH` are exceptions and are set again on the container side. What you write in the `%environment` section of a definition file is transcribed into the image as a script and read at container startup.

If you set an environment variable named `APPTAINERENV_***` (where `***` is any variable name) on the host, it is set inside the container as a variable named `***`. This lets you preset a variable inside the container without disturbing the host environment, and lets you temporarily override an `%environment` setting without rebuilding the image.

```console
export APPTAINERENV_WORKFILE=/data/input.dat
apptainer exec ubuntu2404.sif env | grep WORKFILE
```

Example output:

```text
WORKFILE=/data/input.dat
```

When the same variable is set in more than one way, `APPTAINERENV_***` takes highest precedence, followed by the `%environment` setting, and finally the value inherited from the host. The `--env` option can also be used to pass individual variables.

```console
apptainer exec --env MYVAR=abc ubuntu2404.sif env | grep MYVAR
```

#### Binding Directories { #bind-directories }

At container startup, Apptainer automatically binds (mounts so that they are visible from inside the container) the following directories.

- The home directory
- `/tmp`, `/var/tmp`
- `/dev`, `/proc`, `/sys`
- The current directory at startup (if a directory of the same name exists in the container)

To bind other directories, use the `-B` option (short for `--bind`). Separate the host path and the mount point in the container with a colon (if the mount point is omitted, the path is bound at the same location). The group area `/data1/<group>` is not bound automatically, so specify it explicitly when you want to use it from inside the container.

```console
apptainer exec -B /data1/<group> ubuntu2404.sif ls /data1/<group>
apptainer exec -B /data1/<group>:/work ubuntu2404.sif ls -al /work
```

To mount read-only, add `ro` after another colon. The following example refers to reference data placed in the group area as read-only.

```console
apptainer exec -B /data1/<group>/reference:/opt/data:ro ubuntu2404.sif ls -al /opt/data
```

Multiple directories can be given by repeating `-B` or by separating them with commas. They can also be set in advance in the `APPTAINER_BIND` environment variable.

```console
export APPTAINER_BIND='/data1/<group>/input:/opt/input:ro,/data1/<group>/output:/opt/output'
```

!!! note

    The current directory is bound automatically by default, so starting a container from `/usr/bin`, `/usr/lib`, or a similar location replaces the directory of the same name in the container with the host one, which can cause runtime errors. Avoid starting containers from system directories.

### Keeping a Container Resident with Instances { #instances }

With `exec` and `run`, the container ends when the application ends, so running them repeatedly accumulates container startup overhead. They are also unsuited to operating a resident service such as a server. An instance keeps a container running so that you can run several applications inside it.

```console
apptainer instance start ubuntu2404.sif noble
apptainer instance list
```

Example output:

```text
INSTANCE NAME    PID       IP    IMAGE
noble            <PID>           /home/<username>/ubuntu2404.sif
```

A running instance is referred to as `instance://<name>`.

```console
apptainer exec instance://noble cat /etc/os-release
```

When processing many files repeatedly, using an instance instead of starting a container each time reduces startup overhead and improves throughput.

```bash
apptainer instance start appl.sif worker
for data in data.*
do
    apptainer exec instance://worker appl ${data}
done
apptainer instance stop worker
```

You can also start several instances at once and run processing in different environments in parallel within a single job. More generally, instances are used to keep some service, such as a database or a web server, running on a node. Processing that you want to run automatically when an instance starts is written in `%startscript` in the definition file instead of `%runscript`.

Stopping an instance:

```console
apptainer instance stop noble
```

### Running Directly from a Repository { #run-from-repository }

You can specify a repository directly to `exec` and other commands. On the first run, the image is converted to SIF and cached under `~/.apptainer`.

```console
apptainer exec docker://ubuntu:24.04 head -n 5 /etc/os-release
```

On later runs, Apptainer checks whether the repository has been updated and runs the image after synchronizing, making maximum use of the cache. If there is no update, the cached SIF image is started directly.

Checking and clearing the cache:

```console
apptainer cache list -v
NAME                     DATE CREATED           SIZE             TYPE
1991bd789d7184290c3cce   2026-07-16 11:33:11    0.61 KiB         blob
2c999b3bd705fad8b11574   2026-07-16 18:02:14    1.01 KiB         blob
3f26bc2dec0b515f1c2818   2026-07-16 18:01:58    3.90 MiB         blob
45e09956dc667c5eff3583   2026-07-16 18:01:58    1.00 KiB         blob
4b987da45db4d6278590ab   2026-07-13 11:21:35    27.55 MiB        blob
5de55e5ef9c03399744146   2026-07-16 11:33:11    3.99 MiB         blob
7f622ca8766bccb22f0424   2026-07-13 11:21:35    0.41 KiB         blob
ab3fe4defd29ba6231229a   2026-07-16 18:01:58    0.61 KiB         blob
ac1e79f92e8f480400c312   2026-07-16 18:02:14    67.29 MiB        blob
b8ccdf7026bcaa90f19f3b   2026-07-16 18:02:14    0.61 KiB         blob
e7a1a92a5bfeee40966aea   2026-07-16 11:33:11    1.00 KiB         blob
ea17ec341c4211d1dd7f18   2026-07-13 11:21:35    2.02 KiB         blob
4980a8b73e769874ff1544   2026-07-16 18:02:16    65.32 MiB        oci-tmp
5f34df5144d4fcbe7d206e   2026-07-16 18:01:59    3.82 MiB         oci-tmp
d8695c491922692fbdb835   2026-07-16 17:25:50    27.61 MiB        oci-tmp
tmp_1601666898           2026-07-16 18:02:18    0.00 KiB         oci-tmp

There are 4 container file(s) using 96.75 MiB and 12 oci blob file(s) using 102.74 MiB of space
Total space used: 199.49 MiB

apptainer cache clean
```

!!! note

    Because this way of running follows updates on the repository side, it is not suited to keeping a runtime environment that is known to work. We recommend limiting it to cases such as always wanting to pick up the latest version.

### Overlays { #overlay }

A SIF image is read-only, but a writable layer can be laid over it using the OverlayFS feature of the Linux kernel. There are two ways to do this.

1. The `--writable-tmpfs` option: lays an in-memory tmpfs over the image as a temporary writable area
2. The `--overlay` option: lays a separately prepared persistent writable area (an overlay image) over it

With `--writable-tmpfs`, you can create new files and directories anywhere, but you cannot change existing files in the image, and the changes are lost when the container ends.

```console
apptainer shell --writable-tmpfs something.sif
Apptainer> echo hogefuga > /etc/testfile        # Creating a new file works
Apptainer> echo hogefuga > /etc/os-release      # Existing files cannot be changed
bash: /etc/os-release: Permission denied
```

A persistent overlay image is created and used as follows.

```console
# Create a 1 GiB overlay image, and create the mount directory in advance
apptainer overlay create --size 1024 --create-dir /usr/share/apps overlay.img

# Lay the overlay over the image and expand data (writes go to the overlay)
apptainer exec --overlay overlay.img core.sif tar xzf reference-data.tar.gz -C /usr/share/apps

# Lay the overlay over the image at run time
apptainer exec --overlay overlay.img core.sif ls -al /usr/share/apps
```

When the same file exists in both the SIF and the overlay, the overlay takes precedence, so this can also be used to modify parts of an image. An overlay image is simply a file in ext3 format and can be resized with `resize2fs`. If you pass a SIF file as the argument to `apptainer overlay create`, the overlay can also be embedded in the SIF and operated as a single file.

For workloads with a large number of small files, taking them into an overlay also helps reduce metadata access load on the shared file system.

## GPU and MPI { #gpu-and-mpi }

### Using GPUs { #gpu }

The GPU driver on the host supports CUDA 13.0, so the CUDA toolkit used inside a container must be version 13.0 or earlier.

To use a GPU from inside a container, specify the `--nv` option. The following is an example run inside a job with 4 GPUs allocated.

```console
apptainer exec --nv docker://ubuntu:24.04 nvidia-smi -L
```

Example output:

```text
GPU 0: NVIDIA GB200 (UUID: <omitted>)
GPU 1: NVIDIA GB200 (UUID: <omitted>)
GPU 2: NVIDIA GB200 (UUID: <omitted>)
GPU 3: NVIDIA GB200 (UUID: <omitted>)
```

As shown, the host GPUs can be recognized from inside the container. Note that within a job only the GPUs allocated by Slurm are visible (for example, in a `--gpus=1` job only GPU 0 is shown). When `--nv` is specified, Apptainer does the following.

1. Makes GPU devices such as `/dev/nvidia*` available inside the container (`/dev/nvidia*` appears in the container)
2. Binds the NVIDIA driver libraries from the host into the container
3. Sets `LD_LIBRARY_PATH` inside the container so that the bound libraries are used

The basic division of roles is to include the CUDA toolkit and frameworks (PyTorch and so on) in the container image, and to bring in the driver from the host with `--nv`. GPU images can be fetched as arm64 (aarch64) builds from NVIDIA NGC (`docker://nvcr.io/...`); see [Creating Images from the Command Line](#build-image-cli).

### MPI Parallelization { #mpi }

#### Intra-node Parallelization { #mpi-intra-node }

MPI parallelization that completes within a single node can be run simply by starting `mpirun` or `mpiexec` inside the container. The process manager starts the application directly inside the container, so no coordination with the outside is needed. This assumes that the MPI runtime is included in the container.

```console
apptainer exec mpi-apps.sif mpiexec --bind-to none -np 8 ~/myapps/hoge inputfile
```

In this case only one container is started, and several processes run inside it.

!!! note

    With images that bundle an HPC-X build of Open MPI (such as the nvhpc images from NGC), the `OPAL_PREFIX` and `LD_LIBRARY_PATH` settings described in the note in [Container-bundled Open MPI with srun --mpi=pmix](#mpi-container-pmix) are required even for intra-node runs.

#### How Multi-node Parallelization Works { #mpi-multi-node }

MPI parallelization that spans several nodes cannot be started in the same way as intra-node parallelization, because the container environment is not yet running at the point where processes are started on the other nodes. For multi-node parallelization, starting the container is made part of starting the processes: the process manager on the host starts `apptainer exec`. Note that the order of `mpirun` (`srun`) and `apptainer` is the reverse of intra-node parallelization.

Several nodes are allocated by specifying the number of GPUs (with 4 per node, `--gpus=8` gives 2 nodes; see [Working with Slurm](#slurm)).

The following is an example run inside a `--gpus=8 --ntasks-per-node=4` job, with 2 nodes allocated.

```console
srun --mpi=pmix apptainer exec ubuntu2404.sif hostname
```

Example output:

```text
c146
c146
c146
c146
c147
c147
c147
c147
```

With this approach, the MPI on the host and the MPI in the container must work together, so version consistency between them matters. Two approaches are available on this system.

#### Binding the Host-provided MPI { #mpi-host-bind }

NVIDIA HPC-X is provided on the host of this system as the `nvhpc-hpcx` module. HPC-X is an Open MPI build installed as part of the HPC SDK and is optimized for GPUs and the InfiniBand interconnect.

The actual Open MPI and UCX libraries live in the HPC SDK tree, so bind the HPC SDK directory as a whole into the container and tell the container where the libraries are through environment variables. Building your application with `mpicc` on the host is the sure way to match the ABI (Application Binary Interface) of the host MPI.

```bash
#!/bin/bash
#SBATCH -A <project-ID>
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

module load nvhpc-hpcx

# Derive the location of the host Open MPI (OPAL_PREFIX) from the real path of mpirun
OMPI_PREFIX=$(readlink -f "$(which mpirun)"); OMPI_PREFIX=${OMPI_PREFIX%/bin/mpirun}
UCX_LIB="<UCX lib directory>"       # hpcx-*/ucx*/lib in the HPC SDK (where libucp.so is;
                                    # find it with: find /shared/software/hpc_sdk -name libucp.so)

mpirun --bind-to none -np 8 apptainer exec --nv -B /shared/software/hpc_sdk \
  --env OPAL_PREFIX=$OMPI_PREFIX \
  --env LD_LIBRARY_PATH=$OMPI_PREFIX/lib:$UCX_LIB \
  mpi-apps.sif ~/myapps/hoge inputfile
```

#### Container-bundled Open MPI with srun --mpi=pmix { #mpi-container-pmix }

If you want to avoid depending on the host MPI and prioritize the portability of the container, you can bundle Open MPI in the container and start processes through the PMIx integration of Slurm.

```console
srun --mpi=pmix apptainer exec mpi-apps.sif ~/myapps/hoge inputfile
```

With this approach, Slurm on the host starts a container on each node, and the MPI runtime bundled in the container gathers the processes through PMIx.

!!! note

    Images that bundle an HPC-X build of Open MPI, such as the nvhpc images from NGC, have the installation path from build time baked in, so `MPI_Init` fails as they are (with errors such as `PML ob1 cannot be selected`). At run time, specify `--env OPAL_PREFIX=<ompi prefix in the container>` and `--env LD_LIBRARY_PATH=<ompi/lib>:<ucx/lib>`. Look for `hpc_sdk/**/hpcx-*/ompi` in the container to find the prefix.

At run time, many UCX errors for the shared memory transport (`mm_posix ... Permission denied`) may be printed, but the run falls back to another transport and completes normally. If you bundle a different MPI, check that it works beforehand.

### MPI Parallel Jobs { #mpi-job }

The following is an example job script for the container-bundled Open MPI with PMIx approach.

```bash
#!/bin/bash
#SBATCH -A <project-ID>
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

srun --mpi=pmix apptainer exec --nv ~/mpi-apps.sif ~/myapps/hoge inputfile
```

The available MPI plugins can be listed with `srun --mpi=list`.

```console
srun --mpi=list
```

Example output:

```text
MPI plugin types are...
	none
	cray_shasta
	pmi2
	pmix
specific pmix plugin versions available: pmix_v5
```

## Working with Slurm { #slurm }

Apptainer works closely with the host environment, so you can use it in a job script without being very aware that a container is involved. For how to submit jobs, see [Slurm](slurm.md); for the number of GPUs you can request and the resulting node count, CPU cores, and memory, see [Job Resources](resources.md).

### Embedding the Run Command in the Image { #slurm-embedded-runscript }

Setting `%environment` and `%runscript` in the image lets you keep job scripts simple.

Definition file:

```text
Bootstrap: docker
From: ubuntu:24.04

%environment
    export OMP_NUM_THREADS=8
    export MYCODE_CONFIG=/usr/share/MyApps/hoge.json

%runscript
    python3 /usr/share/MyApps/hoge.py "$@"
```

If you save this image as `hoge` in a directory on your PATH with the execute permission set, the job script becomes no different from running an ordinary application.

```bash
#!/bin/bash
#SBATCH -A <project-ID>
#SBATCH --time=00:15:00

hoge input.txt
```

### Interactive Execution { #slurm-interactive }

To use a compute node interactively, allocate a node with `salloc` and start a shell with `srun`.

```console
salloc -A <project-ID> --gpus=1 --time=00:30:00
srun --pty bash -i
```

Once the shell starts on the compute node, you can work with containers directly.

```console
apptainer shell ubuntu2404.sif
```

Inside an interactive job you can perform all of the operations described on this page (building images, editing sandboxes, checking GPU behavior, and so on) interactively.
