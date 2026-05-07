'use client';

import { useState } from 'react';
import { 
  Mail, Inbox, Send, Trash2, FileText, 
  RefreshCw, PlusCircle, Reply, Forward, ArrowLeft
} from 'lucide-react';

interface Email {
  id: string;
  folder: 'inbox' | 'sent' | 'trash';
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  date: string;
  content: string;
  unread?: boolean;
}

interface Props {
  extraMails?: Email[];
  onEmailRead?: (id: string) => void;
}

export const MailApp = ({ extraMails = [], onEmailRead }: Props) => {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox');
  const [readingMailId, setReadingMailId] = useState<string | null>(null);

  const [initialMails, setInitialMails] = useState<Email[]>([
    {
      id: 'm_d1',
      folder: 'inbox',
      from: 'Google セキュリティ',
      fromEmail: 'no-reply@accounts.google.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '新しいデバイスからのログインがありました',
      date: '2021/04/11',
      content: '佐藤 様\n\nお使いの Google アカウント（sato_archive@iris.local）への新しいログインが、Windows デバイスから検出されました。\n\n日時: 2021年4月11日 07:15 (JST)\nデバイス: Windows PC\n場所: 千葉県習志野市（IPアドレスから推測）\n\n心当たりがある場合は、このメールを無視してください。心当たりがない場合は、アカウントの安全を確保するために、パスワードの変更を推奨します。'
    },
    {
      id: 'm_k1',
      folder: 'inbox',
      from: '伊藤 (M.Ito)',
      fromEmail: 'm-ito@iris.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '元気か？',
      date: '2021/04/13 21:10',
      unread: true,
      content: '佐藤、最近連絡つかないけど元気か？\n\nそういえば、お前が使ってた例の共有フォルダのパス、忘れたから教えてくれよ。昔みたいにまたハナの誕生日とかにしてるのか？お前、大事なパスワードは全部それにしてたもんな（笑）\n\nまあ、気が向いたら連絡くれ。今度ハナの散歩、俺も付き合うよ。'
    },
    {
      id: 'm1',
      folder: 'inbox',
      from: 'さくら動物病院',
      fromEmail: 'info@sakura-vet.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '【重要：ハナ様】4月の定期検診および混合ワクチン接種のご案内',
      date: '2021/04/10 10:25',
      unread: true,
      content: '佐藤様\n\nいつも大変お世話になっております。さくら動物病院です。\n愛犬ハナ様の定期検診および混合ワクチンの接種時期が近づいておりますのでご案内申し上げます。\n\n【ご予約内容】\n日時：2021年4月25日（日） 10:00 〜\n内容：身体検査、血液検査、8種混合ワクチン接種\n\n【現在のハナ様の登録情報】\n名前：ハナ\n犬種：柴犬（赤）\n性別：メス\n生年月日：2018年04月29日（現在3歳）\n体重（前回）：9.45kg\nマイクロチップID：8042-9963-8151\n備考：アレルギー歴なし、少し怖がりな性格ですので、当日はケージに入れてのご来院をお願いします。\n\nハナ様は今月末に4歳のお誕生日ですね。当院でもささやかなプレゼントをご用意しております。当日のご来院をスタッフ一同お待ちしております。'
    },
    {
      id: 'm2',
      folder: 'inbox',
      from: 'D-DROP 運営局',
      fromEmail: 'admin@d-drop.net',
      to: 'ADMIN_IRIS',
      toEmail: 'sato_archive@iris.local',
      subject: '重要：アーカイブ解読用ツール(D-DROP Decryptor)配置のお知らせ',
      date: '2021/04/12 14:02',
      unread: false,
      content: 'ADMIN_IRIS 様\n\nアーカイブサーバーの秘匿データ保護およびアクセスのため、解読用ツール(D-DROP Decryptor)を更新しました。\n下記URLより最新のツールをダウンロードして実行してください。\n\nURL: http://d-drop.net/archive/tools\n\n【認証について】\nツールの実行には、登録済み電話番号によるリアルタイム認証が必要です。ツール起動後に電話番号を入力し、「コード送信」をリクエストしてください。ご本人確認が取れ次第、このメールアドレス宛にワンタイムパスワードが送信されます。\n\n不必要なログは速やかに削除し、証拠となるデータは暗号化アーカイブに移動してください。\nこのメッセージは読了後、直ちに削除（Shift+Delete）することを強く推奨します。'
    },
    {
      id: 'm_d2',
      folder: 'inbox',
      from: 'Netflix',
      fromEmail: 'info@netflix.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '佐藤さん、あなたにおすすめの最新作が追加されました',
      date: '2021/04/11 12:00',
      content: '佐藤さん、こんにちは！\n\nNetflixに新着作品が登場しました。あなたがこれまでに視聴した「クリミナル・マインド」や「シャーロック」に基づき、以下の作品をおすすめします。\n\n・『未解決事件：消えた少女の行方』\n・『サイバー犯罪の闇：ダークウェブの真実』\n・『ドキュメンタリー：監視カメラは見ていた』\n\n週末のお供にぜひお楽しみください。'
    },
    {
      id: 'm3',
      folder: 'inbox',
      from: '県警・防犯メールマガジン',
      fromEmail: 'safety-mail@police.local',
      to: '配信希望者様',
      toEmail: 'sato_archive@iris.local',
      subject: '【緊急】習志野市内での不審者情報および行方不明事案',
      date: '2021/04/14 18:30',
      unread: true,
      content: '習志野警察署からの緊急連絡です。\n\n本日4月14日午後15時10分頃、津田沼駅周辺において、下校途中の少女が何者かによって車両に連れ去られる事案が発生しました。\n犯人は複数人と見られ、現在も高速道路を利用して都内または千葉県北東部へ逃走している可能性があります。\n\n【事案概要】\n場所：習志野市津田沼1丁目 付近\n車両：黒色のワンボックスカー（成田ナンバー、特徴：リアガラスに傷あり）\n犯人：30代〜40代の男3名。いずれも作業服のような紺色の服を着用。\n\n近隣住民の皆様は、戸締まりを徹底し、不要不急の外出を控えてください。また、付近を走行していた車両で、ドライブレコーダーの映像を提供いただける方は、習志野警察署（XX-XXXX-XXXX）までご連絡をお願いいたします。'
    },
    {
      id: 'm_d3',
      folder: 'inbox',
      from: '東京電力エナジーパートナー',
      fromEmail: 'service@tepco.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '【重要】4月分電気ご使用量とご請求予定額のお知らせ',
      date: '2021/04/13 09:30',
      content: '佐藤 様\n\nいつも東京電力をご利用いただきありがとうございます。\n2021年4月分のご使用量およびご請求予定額が確定いたしました。\n\n■ご請求予定額：6,842円\n■ご使用量：214kWh\n■振替予定日：2021年4月26日\n\n詳細な内訳については、会員専用サイト「くらしTEPCO web」よりご確認ください。'
    },
    {
      id: 'm_d4',
      folder: 'inbox',
      from: 'エニタイムフィットネス津田沼',
      fromEmail: 'info@anytime-tsudanuma.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '4月度会員限定・パーソナルトレーニング体験キャンペーンのお知らせ',
      date: '2021/04/13 15:45',
      content: '佐藤様\n\nエニタイムフィットネス津田沼店です。最近、トレーニングの調子はいかがでしょうか？\n今月は、会員様限定でプロのトレーナーによる個別セッションが1回無料で体験できるキャンペーンを実施中です。\n\n「もっと効率的に筋肉をつけたい」「正しいフォームを確認したい」という方は、この機会にぜひお申し込みください。スタッフ一同、お待ちしております！'
    },
    {
      id: 'm_d5',
      folder: 'inbox',
      from: 'VISAカード',
      fromEmail: 'v-pass@visa.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: 'カードご利用確認のお願い',
      date: '2021/04/14 21:00',
      unread: true,
      content: '佐藤 様\n\nいつも弊社カードをご利用いただきありがとうございます。\n現在、お客様のカードにおいて、通常のご利用パターンとは異なる決済が検出されました。\n\n■ご利用日時：2021/04/14 20:45\n■ご利用金額：128,000円\n■加盟店：PC-PARTS WEB SHOP\n\nご本人様による利用であれば、特に回答の必要はございません。もし心当たりがない場合は、至急カードの利用停止手続きを行ってください。'
    },
    {
      id: 'm_d6',
      folder: 'inbox',
      from: '楽天トラベル',
      fromEmail: 'reserve@travel.rakuten.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '【予約確認】三浦海岸 磯の香ホテル 2021/05/02より1泊',
      date: '2021/04/15 09:40',
      unread: true,
      content: '佐藤様\n\n楽天トラベルをご利用いただきありがとうございます。下記の内容で予約を承りました。\n\n【宿泊情報】\n宿泊先：三浦海岸 磯の香ホテル\nチェックイン日：2021/05/02 (日) 15:00\nチェックアウト日：2021/05/03 (月) 11:00\nプラン名：GW特別！愛犬と泊まる海辺の休日プラン（夕朝食付き）\n\nハナ様同伴でのご宿泊ですね。ペット専用アメニティ、ドッグランの利用もプランに含まれております。当日はハナ様と一緒に潮風を楽しんでください。'
    },
    {
      id: 'm_d7',
      folder: 'inbox',
      from: '習志野市役所 防災課',
      fromEmail: 'bousai@narashino-city.local',
      to: '住民各位',
      toEmail: 'sato_archive@iris.local',
      subject: '春の防災訓練実施のお知らせ',
      date: '2021/04/15 11:15',
      unread: true,
      content: '習志野市民の皆様へ\n\n今週末、習志野市全域にて春の防災訓練を実施いたします。午前10時に防災行政無線よりサイレンが鳴りますので、避難経路の確認を行ってください。'
    },
    {
      id: 's1',
      folder: 'sent',
      from: '佐藤',
      fromEmail: 'sato_archive@iris.local',
      to: 'K',
      toEmail: 'k_private_08@black.local',
      subject: 'Re: 4月15日の件',
      date: '2021/04/14 23:45',
      content: 'Kへ\n\n準備は整った。明日の10時に機材を搬入する。\n例のブツは津田沼の廃ビルに運ぶつもりだ。周囲に監視カメラがないことは確認済みだ。あそこなら誰にも見つかることはない。\n\n終わったらすぐにD-DROPにログを上げる。\n完了報告が上がるまで、こちらからの連絡を待て。\n\n今回の件、絶対に失敗は許されないぞ。報酬は約束通り、完了後にビットコインで送金する。'
    },
    {
      id: 't_spam1',
      folder: 'trash',
      from: '未亡人・マゆミ',
      fromEmail: 'anteater-sorrow@ezweb.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '私の夫は大アリクイに殺されました',
      date: '2021/04/01 10:00',
      content: '突然のメール失礼します。\n実は先日、私の夫が近所の公園で大アリクイに不意に襲われ、命を落としてしまいました。\nあまりに突然の出来事で、悲しみに暮れる日々を過ごしております。誰にも言えないこの孤独を、どなたか優しい方に聞いていただきたくてメールしました。もしよろしければ、お話し相手になっていただけませんか？'
    },
    {
      id: 't1',
      folder: 'trash',
      from: 'K',
      fromEmail: 'k_private_08@black.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '場所の特定について',
      date: '2021/04/13 21:10',
      content: '佐藤さん\n\n廃ビルの地下、あそこなら誰にも見つかりませんね。防音対策も済ませておきました。外部への音漏れは一切ありません。\n\n予定通り、15日の15時10分に決行します。ターゲットの写真は昨日送った通りです。間違えないようにしてください。\n\nこのメールを見たらすぐに消してくださいよ。証拠は残さないのが鉄則ですから。'
    },
    {
      id: 't2',
      folder: 'trash',
      from: 'Amazon.co.jp',
      fromEmail: 'ship-confirm@amazon.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: 'ご注文の商品を発送いたしました',
      date: '2021/04/12 08:30',
      content: '佐藤様、Amazon.co.jpをご利用いただきありがとうございます。\n本日、以下の商品を発送いたしましたのでお知らせします。\n\n■商品内容：\n・結束バンド（耐候性・黒） 100本入り x 2セット\n・大型ダッフルバッグ（120L、高耐久撥水仕様）\n・粘着テープ（超強力・布製、シルバー）\n・アイマスク（完全遮光タイプ）\n\nお届け予定日：2021/04/13\n配送業者：ヤマト運輸\n\n【お届け先情報】\nお名前：佐藤 裕也 様\n住所：千葉県習志野市津田沼 2-17-1 メゾン津田沼 302号室\n電話番号：040-6381-1510'
    },
    {
      id: 't_spam2',
      folder: 'trash',
      from: '松本潤',
      fromEmail: 'arashi-official@johnnys.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: 'こんにちは、松本潤です。',
      date: '2021/04/02 15:30',
      content: 'こんにちは。松本潤です。今、隣に二宮もいます。\nこんにちは、二宮和也です。\n\n実は今、撮影の合間にこっそりプライベートのアドレスからメールしています。嵐の活動休止後、ゆっくり過ごす時間が増えて、新しい出会いを求めていました。僕たちと秘密の友達になって、普段は話せない悩みや思い出を共有しませんか？返信待ってます。'
    },
    {
      id: 't_d3',
      folder: 'trash',
      from: 'ビットコイン・マスター',
      fromEmail: 'crypto-inv@btc.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '【必見】明日までに資産を100倍にする方法',
      date: '2021/03/28 14:20',
      content: '佐藤様、仮想通貨の波に乗り遅れていませんか？今すぐ参加すれば、特別なインサイダー情報を無料で公開します。'
    },
    {
      id: 't_d4',
      folder: 'trash',
      from: 'JCBカード 事務局',
      fromEmail: 'support@jcb.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: 'システムメンテナンスに伴うサービス一時停止のお知らせ',
      date: '2021/03/20 02:00',
      content: 'JCBカードをご利用のお客様へ。以下の期間、システムメンテナンスのためWebサービスを停止いたします。ご不便をおかけしますが、ご理解のほどよろしくお願いいたします。'
    },
    {
      id: 't_police',
      folder: 'trash',
      from: '警視庁 捜査支援分析センター',
      fromEmail: 'cyber-support@npa.go.local',
      to: '住民各位',
      toEmail: 'sato_archive@iris.local',
      subject: '【重要】5年前の習志野市における略取誘拐事件に関する情報提供のお願い',
      date: '2021/04/16 09:15',
      content: '習志野市民の皆様、および周辺地域の皆様へ\n\n警視庁 捜査支援分析センターです。昨日発生した習志野市津田沼における少女誘拐事件について、現在総力を挙げて捜査を行っております。\n\n犯行グループは高度な暗号化ツールやログ隠蔽ソフト（D-DROP等）を使用している可能性があり、デジタル上の証拠の確保が急務となっています。\n\nもし、不審なログ解析データや、犯行グループとの接点を示す機密ファイル等を入手された方は、直ちに下記の警視庁専用・証拠提出ポータルより情報の提供をお願いいたします。\n\nURL: http://cyber-sec.npa.go.local/submit\n\n皆様の勇気ある情報提供が、一人の少女の命を救うことに繋がります。ご協力をお願いいたします。'
    },
    {
      id: 't_d5',
      folder: 'trash',
      from: '旧友・伊藤',
      fromEmail: 'ito_m@docomo.local',
      to: '佐藤',
      toEmail: 'sato_archive@iris.local',
      subject: '久しぶり！今度飲みに行かない？',
      date: '2021/02/10 19:45',
      content: '佐藤、元気か？津田沼の方に引っ越したって聞いてから連絡できてなかったな。仕事の方は落ち着いたか？また昔みたいに、みんなで駅前の居酒屋で飲もうぜ！返信待ってる。'
    }
  ]);

  const allMails = [...initialMails, ...extraMails];
  const currentMails = allMails.filter(m => m.folder === selectedFolder);
  const readingMail = allMails.find(m => m.id === readingMailId);

  const handleReadMail = (id: string) => {
    setReadingMailId(id);
    onEmailRead?.(id);
    setInitialMails(prev => prev.map(m => 
      m.id === id ? { ...m, unread: false } : m
    ));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'Tahoma, sans-serif', color: '#000', userSelect: 'text' }}>
      <div style={{ height: 60, background: '#ece9d8', borderBottom: '1px solid #aca899', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 10, userSelect: 'none' }}>
        {readingMailId ? (
          <button onClick={() => setReadingMailId(null)} style={xpBtnStyle}><ArrowLeft size={16} /> 戻る(B)</button>
        ) : (
          <>
            <div style={{ padding: '5px 10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={20} color="#0055e0" /> Outlook Express
            </div>
            <div style={{ flex: 1 }} />
            <button style={xpBtnStyle}><RefreshCw size={16} color="#0055e0" /> 送受信</button>
            <button style={xpBtnStyle}><PlusCircle size={16} color="#008000" /> 作成</button>
          </>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 150, background: '#fff', borderRight: '1px solid #aca899', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
          <div style={{ padding: '5px 10px', background: '#ece9d8', borderBottom: '1px solid #aca899', fontSize: 11, fontWeight: 'bold' }}>フォルダ</div>
          <div style={{ padding: 5 }}>
            <FolderBtn icon={<Inbox size={14} />} text="受信トレイ" active={selectedFolder === 'inbox'} onClick={() => { setSelectedFolder('inbox'); setReadingMailId(null); }} />
            <FolderBtn icon={<Send size={14} />} text="送信済み" active={selectedFolder === 'sent'} onClick={() => { setSelectedFolder('sent'); setReadingMailId(null); }} />
            <FolderBtn icon={<Trash2 size={14} />} text="削除済み" active={selectedFolder === 'trash'} onClick={() => { setSelectedFolder('trash'); setReadingMailId(null); }} />
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflowY: 'auto', background: '#fff' }}>
          {readingMail ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '15px 20px', background: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: 18, color: '#003399' }}>{readingMail.subject}</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#000' }}>
                  <div><strong>差出人:</strong> {readingMail.from} &lt;{readingMail.fromEmail}&gt;</div>
                  <div><strong>宛先:</strong> {readingMail.to} &lt;{readingMail.toEmail}&gt;</div>
                  <div><strong>日時:</strong> {readingMail.date}</div>
                </div>
              </div>
              <div style={{ flex: 1, padding: '25px', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#000', borderTop: '1px solid #fff' }}>
                {readingMail.content}
              </div>
              <div style={{ padding: '10px 20px', background: '#ece9d8', borderTop: '1px solid #aca899', display: 'flex', gap: 10, userSelect: 'none' }}>
                <button style={xpBtnStyle}><Reply size={14} /> 返答</button>
                <button style={xpBtnStyle}><Forward size={14} /> 転送</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', display: 'flex', fontSize: 11, userSelect: 'none' }}>
                <div style={{ ...thStyle, width: 30 }}>!</div>
                <div style={{ ...thStyle, flex: 2 }}>差出人</div>
                <div style={{ ...thStyle, flex: 3 }}>件名</div>
                <div style={{ ...thStyle, flex: 2 }}>受信日時</div>
              </div>
              {currentMails.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>メールはありません</div>
              ) : (
                currentMails.map(mail => (
                  <div 
                    key={mail.id}
                    onClick={() => handleReadMail(mail.id)}
                    style={{ 
                      display: 'flex', padding: '4px 0', borderBottom: '1px solid #eee', cursor: 'default', fontSize: 12,
                      background: mail.unread ? '#fff' : '#f9f9f9',
                      fontWeight: mail.unread ? 'bold' : 'normal'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = mail.unread ? '#fff' : '#f9f9f9'; e.currentTarget.style.color = '#000'; }}
                  >
                    <div style={{ width: 30, display: 'flex', justifyContent: 'center' }}>{mail.unread && <Mail size={12} fill="#0055e0" color="#0055e0" />}</div>
                    <div style={{ flex: 2, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mail.from}</div>
                    <div style={{ flex: 3, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mail.subject}</div>
                    <div style={{ flex: 2, padding: '0 8px' }}>{mail.date}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function FolderBtn({ icon, text, active, onClick }: any) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 8px', fontSize: 11, background: active ? '#316ac5' : 'transparent', color: active ? '#fff' : '#000', cursor: 'default' }}>
      {icon}<span>{text}</span>
    </div>
  );
}

const xpBtnStyle: React.CSSProperties = {
  padding: '4px 12px', background: '#ece9d8', border: '1px solid #aca899', borderRadius: 3, cursor: 'default', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5,
  boxShadow: 'inset 1px 1px #fff, 1px 1px 1px rgba(0,0,0,0.1)'
};

const thStyle: React.CSSProperties = { padding: '4px 8px', borderRight: '1px solid #aca899', fontWeight: 'normal' };
