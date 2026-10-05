# ジョブ実行資源

ジョブを投入する際はGPU数を指定します。<span class="text-marker">指定できるGPU数は、1、2、3、および4の倍数</span>です。1ジョブあたりのGPU数・ノード数に上限はありません。GPU数によって、確保されるノード数、最大CPUコア数、最大メモリ量が異なります。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th style="text-align: right;">GPU数</th>
      <th>確保されるノード数</th>
      <th>最大CPUコア数/ノード</th>
      <th>最大メモリ量/ノード</th>
      <th>最大実行時間</th>
    </tr>
    <tr>
      <td style="text-align: right;">1</td>
      <td rowspan="4">1</td>
      <td>32</td>
      <td>400 GB</td>
      <td rowspan="8">96時間</td>
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
      <td style="text-align: right;">20以上（4の倍数）</td>
      <td>GPU数÷4</td>
    </tr>
  </tbody>
</table>
</div>

!!! note

    GPUを使用しないジョブでも、GPU数の指定が必要です（Nノードを使用する場合は`--gpus=4N`）。また、今後の混雑状況に応じて、1ジョブあたりのGPU数に上限を設ける場合があります。

!!! note

    表中の最大メモリ量は、GPUメモリとCPUメモリを合わせた利用可能量の目安です。GPUメモリは1 GPUあたり173.2 GiBです。GB200 NVL4ではCPU-GPU間がNVLink-C2Cでキャッシュコヒーレントに接続されているため、CPUとGPUは互いのメモリへアクセスできます。CPUメモリとGPUメモリは性能特性が異なることに注意してください。
