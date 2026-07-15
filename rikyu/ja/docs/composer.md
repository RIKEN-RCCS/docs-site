# Open Composerの使い方

Open Composerとは、Open OnDemand上で動作するアプリケーションであり、バッチジョブの作成・投入を行うことができます。バッチジョブとはジョブスケジューラによって非対話的に実行される計算タスクのことであり、シェルスクリプトで記述されます。計算資源はジョブスケジューラのディレクティブ（例：`#SBATCH --gpus=4`）で指定します。

## ジョブスクリプトの作成

Open OnDemandのダッシュボードから<span class="text-marker">Slurm</span>を選択します。

<img width="800" alt="Open OnDemand" src="img/ood.png" style="border: 1px solid #000;">

背景が白色のWebフォームに値を入力すると、右下のテキストエリアにジョブスクリプトが生成されます。なお、背景が<span style="background: yellow;">黄色</span>のWebフォームは、ジョブスクリプトに影響しない項目です。Webフォームのラベルにあるアスタリスクは必須項目を指します。
	
![Web form of Slurm](img/composer_slurm.png){ width="800" }

右上の項目の意味は下記の通りです。

| 項目            | 意味                                 |
| --------------- | ------------------------------------ |
| Script location | ジョブスクリプトの保存先ディレクトリ |
| Script name     | ジョブスクリプトのファイル名         |
| Job name        | ジョブ名                             |

!!! note

    テキストエリアを手動で編集した後に背景が白色のWebフォームを変更すると、下記の警告画面が表示されます。<span class="text-marker">Discard and continue</span>をクリックするとテキストエリアで編集した内容は破棄されます。
    
    <img width="400" alt="Warning" src="img/overwrite_warning.png" style="border: 1px solid #000;">

## ジョブの投入

テキストエリアの下部にある<span class="text-marker">Submit</span>をクリックするとジョブが投入されます。成功時には保存場所のパスとHistory Pageへのリンクが表示されます。保存場所のパスをクリックすると、[Open OnDemandのHome Directory](ood.md#home-directory)が起動します。保存場所のパスの横にあるターミナルのアイコンをクリックすると、[Open OnDemandのRIKYU Shell Access](ood.md#rikyu-shell-access)が起動します。

![Link to History Page](img/link_to_history.png){ width="800" }

## ジョブ履歴の閲覧

投入したジョブの履歴を閲覧することができます。

<img width="800" alt="History Page" src="img/history.png" style="border: 1px solid #000;">

* 右上の検索窓は、ジョブ履歴を条件で絞り込むことで、目的のジョブを検索するための機能です。<span class="text-marker">Detail</span>ボタンをクリックすると、より詳細な条件での検索が可能です。
* テーブルのヘッダにある&#9650;と&#9660;をクリックすると、その列をキーとしてテーブル全体が昇順または降順に並び替えられます。デフォルトはJob IDの降順です。
* <span class="text-marker">Job ID</span>の項目のリンクをクリックすると、ジョブの詳細情報が表示されます。

<img width="600" alt="Job details" src="img/job_details.png" style="border: 1px solid #000; margin-left: 30px;">

* <span class="text-marker">Application</span>の項目のリンクをクリックすると、該当アプリケーションのページが開きます。
* <span class="text-marker">Script Location</span>の項目のリンクをクリックすると、[Open OnDemandのHome Directory](ood.md#home-directory)が開きます。また、ターミナルアイコンをクリックすると、[Open OnDemandのRIKYU Shell Access](ood.md#rikyu-shell-access)が起動します。
* <span class="text-marker">Script Name</span>の項目のリンクをクリックすると、実行したジョブスクリプトが表示されます。

   <img width="300" alt="Load parameters" src="img/load_parameters.png" style="border: 1px solid #000; margin-left: 30px;">

* <span class="text-marker">Load parameters</span>をクリックすると、そのジョブスクリプトを作成するために用いられたパラメータがロードされた状態でアプリケーションページが開きます。
* テーブルの左側にあるチェックボックスで対象のジョブを選択し、<span class="text-marker">Cancel Job</span>をクリックすると、キューに登録されているジョブもしくは実行中のジョブをキャンセルできます。
* <span class="text-marker">Delete Info</span>をクリックすると、完了したジョブの情報をテーブルから削除できます。
* テーブルの一番上のチェックボックスをチェックすると、そのページに表示されているすべてのジョブを選択できます。
