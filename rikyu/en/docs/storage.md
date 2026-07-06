# Storage

The storage areas of this system are divided into three types: <span class="text-marker">home area</span>, <span class="text-marker">group area</span>, and <span class="text-marker">scratch area</span>. This page explains the characteristics of each area. Use them according to your purpose.

## Home Area

Each user has a 5 GB home area (`/home/USER_NAME`). `USER_NAME` is the user name. Only the user who owns the area can read and write to it. The home area is suitable for storing per-user configuration files and small work files.

To check home area usage from the command line, run the following command.

```console
$ lfs quota -h -p `lfs project -d $HOME | awk '{print $1}'` /home
Disk quotas for prj 100010 (pid 100010):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
     /home   2.42G       0k      5G       -     511        0 1000000       -
```

`used` is the used capacity, `blimit` is the capacity limit, `files` is the number of files in use, and `ilimit` is the file count limit.

## Group Area

Each group has a 1 TB group area (`/data1/GROUP_NAME`). `GROUP_NAME` is the group name. Members of the same group can read and write to the group area. The group area is suitable for storing large work files and data shared among members of the same group.

To check group area usage from the command line, run the following command (`GROUP_NAME` should be replaced with the group name).

```console
$ lfs quota -h -p `lfs project -d /data1/GROUP_NAME | awk '{print $1}'` /data1
Disk quotas for prj 200013 (pid 200013):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
    /data1      4k       0k      1T       -       1        0 10000000       -
```

`used` is the used capacity, `blimit` is the capacity limit, `files` is the number of files in use, and `ilimit` is the file count limit.

To find your group name from the command line, run the `id` command and check the string beginning with `rkp` shown in `groups=...`. An example is shown below. A single user may belong to multiple groups.

```console
rku00011@c000:~$ id
uid=100010(rku00011) gid=200000(rkuser) groups=200000(rkuser),200013(rkp00010)
```

## Scratch Area

Each compute node has a scratch area (`/tmp`) backed by local SSDs. 1.5 TB is available per GPU. Only the user running the job can read and write to the scratch area. The scratch area is suitable when you want to handle intermediate results and similar data on fast local SSDs during computation.

Files in the scratch area are deleted when the job finishes. Copy any results that need to be preserved to the home area or group area before the job ends.

## Comparison of Storage Areas

The home area and group area are on shared storage, so they can be used from both compute nodes and login nodes. Data can also be shared among multiple compute nodes. The scratch area is a temporary area on the compute node where the job is running and can be used only by processes running on that node. The users who can read and write differ by area: only the user can access the home area and scratch area, while members of the same group can access the group area.

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <th>Mount point</th>
      <th>Capacity</th>
      <th>Use from compute nodes</th>
      <th>Use from login nodes and<br>sharing among multiple nodes</th>
      <th>Users with read/write access</th>
    </tr>
    <tr>
      <td>Home area</td>
      <td><code>/home/USER_NAME</code></td>
      <td>5 GB</td>
      <td rowspan="3">Available</td>
      <td>Available</td>
      <td>Owner only</td>
    </tr>
    <tr>
      <td>Group area</td>
      <td><code>/data1/GROUP_NAME</code></td>
      <td>1 TB per group</td>
      <td>Available</td>
      <td>Members of the same group</td>
    </tr>
    <tr>
      <td>Scratch area</td>
      <td><code>/tmp</code></td>
      <td>1.5 TB per GPU</td>
      <td>Not available</td>
      <td>Owner only</td>
    </tr>
  </tbody>
</table>
</div>

The home area uses 2 PB of high-speed storage (SSD), while the group area uses 10 PB of large-capacity storage (HDD). Note that the home area and group area therefore have different performance characteristics.

## Capacity Increase Requests

To request additional capacity for the home area or group area, create a ticket using the link below.

[Create a Ticket](https://support.r-ccs.riken.jp/hc/ja/requests/new){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }

!!! note

    Charges based on the additional capacity are planned, but no charges will be incurred during Early Access Phase 2. The fees are currently under review.
