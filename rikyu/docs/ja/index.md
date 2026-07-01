!!! warning

    このページは作りかけです。

# はじめに

スーパーコンピュータ「理究」（以下、「理究」）は、AIによる科学研究の革新を目的に[理化学研究所 計算科学研究センター](https://www.r-ccs.riken.jp)に導入されたシステムです。「理究」は、計算ノード400台にNVIDIA GB200 NVL4を搭載し、合計1,600基のNVIDIA Blackwell GPUを備えます。ノード間はNVIDIA Quantum-X800 InfiniBandで最大3.2Tbpsの高速接続を実現しており、FP64演算性能は64.160 PFLOPS、FP8演算性能は15.539 EFLOPSの性能を持ちます。

このユーザマニュアルでは、「理究」の技術的詳細や利用方法について説明します。

## 利用料金

システムの利用料金は300円/GPU時間です。

標準で利用できるディスク容量は、ホームディレクトリがユーザあたり5 GB、グループディレクトリがグループあたり50 GBです。標準容量を超えてディスク容量を追加する場合は、追加容量に応じた課金が必要です。

## アカウントの申請

「理究」のアカウントを申請するには、下記からアカウント申請を行ってください。

[アカウント申請](https://forms.cloud.microsoft/r/M7ZdHajg9G){ .md-button .md-button--primary .registration-button }

## お問合せ

### AIチャットサポート

「理究」の利用方法について、AIチャットで質問できます。

<section class="section home-section chat-window">
  <iframe
    class="askdona-chat-frame"
    src="../askdona-frame.html?language=ja"
    title="R-CCS RIKYU Assistant"
    sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
    allow="clipboard-write"
  ></iframe>
</section>

### チケットサービス

AIチャットサポートで解決しない場合は、[Zendesk](https://support.r-ccs.riken.jp/hc/ja?brand_id=5378545411486)からお問合せチケットをご送信ください。
