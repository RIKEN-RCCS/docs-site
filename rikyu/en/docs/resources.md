# Job Resources

Specify the number of GPUs when submitting a job. <span class="text-marker">The supported GPU counts are 1, 2, 3, and multiples of 4</span>. There is no upper limit on the number of GPUs or nodes per job. The number of allocated nodes, the maximum number of CPU cores, and the maximum memory amount depend on the number of GPUs.

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th style="text-align: right;">Number of GPUs</th>
      <th>Allocated nodes</th>
      <th>Maximum CPU cores/node</th>
      <th>Maximum memory/node</th>
      <th>Maximum wall time</th>
    </tr>
    <tr>
      <td style="text-align: right;">1</td>
      <td rowspan="4">1</td>
      <td>32</td>
      <td>400 GB</td>
      <td rowspan="8">96 hours</td>
    </tr>
    <tr>
      <td style="text-align: right;">2</td>
      <td>64</td>
      <td>800 GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">3</td>
      <td>96</td>
      <td>1,200 GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">4</td>
      <td rowspan="5">144</td>
      <td rowspan="5">1,600 GB</td>
    </tr>
     <tr>
      <td style="text-align: right;">8</td>
      <td>2</td>
    </tr>
    <tr>
      <td style="text-align: right;">12</td>
      <td>3</td>
    </tr>
    <tr>
      <td style="text-align: right;">16</td>
      <td>4</td>
    </tr>
    <tr>
      <td style="text-align: right;">20 or more (multiple of 4)</td>
      <td>GPU count &divide; 4</td>
    </tr>
  </tbody>
</table>
</div>

!!! note

    Even a job that does not use GPUs must specify the number of GPUs (use `--gpus=4N` for N nodes). An upper limit on the number of GPUs per job may also be introduced in the future depending on congestion.

!!! note

    The maximum memory amount in the table is an estimate of the combined usable GPU memory and CPU memory. GPU memory is 173.2 GiB per GPU. In GB200 NVL4, the CPU and GPU are connected through NVLink-C2C with cache coherency, so the CPU and GPU can access each other's memory. Note that CPU memory and GPU memory have different performance characteristics.
