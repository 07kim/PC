'use client';

import { useState, useEffect } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, ShieldAlert, Lock, RefreshCw, Monitor, X, Folder, FileText, Search, ChevronDown, MonitorPlay, Image as ImageIcon, Music, Trash2, FileAudio, FileVideo } from 'lucide-react';
import { File } from '@/types/os';

interface Props {
  initialUrl?: string;
  systemTime: Date;
  onReportViewed: () => void;
  onDownload?: (appId: string) => void;
  onTrueEndClear?: () => void;
  hasEvidenceFile?: boolean;
  files: File[];
}

export const BrowserApp = ({ initialUrl = 'http://msn.local/', systemTime, onReportViewed, onDownload, onTrueEndClear, hasEvidenceFile, files }: Props) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // D-DROP Login State
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginUser, setLoginUser] = useState<string | null>(null);

  // Evidence Submission State
  const [suspectName, setSuspectName] = useState('');
  const [suspectAddress, setSuspectAddress] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<'idle' | 'analyzing' | 'success' | 'failed'>('idle');
  const [analysisFeedback, setAnalysisFeedback] = useState<string>('');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [pickerFolder, setPickerFolder] = useState<'desktop' | 'documents' | 'pictures' | 'music'>('desktop');
  const [showXPDialog, setShowXPDialog] = useState<string | null>(null);
  const [ddropDownloadState, setDdropDownloadState] = useState<'idle' | 'downloading' | 'complete'>('idle');

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    
    if (showReport && loginUser === 'INTERNAL_ROOT') {
      setDdropDownloadState('idle'); // レポート表示時にリセット
      
      timer1 = setTimeout(() => {
        setDdropDownloadState('downloading');
      }, 7000); // 読む時間を7秒確保

      timer2 = setTimeout(() => {
        setDdropDownloadState('complete');
        onDownload?.('secret');
      }, 7500); // 7秒後（+0.5秒）で完了
    } else {
      setDdropDownloadState('idle');
    }

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showReport, loginUser]);

  const normalizeText = (text: string) => {
    return text
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/[\s　\-－ー]/g, '')
      .toLowerCase();
  };

  const isOldTime = systemTime.getFullYear() <= 2021;
  const isDDROP = url.includes('d-drop.net');
  const isTools = url.includes('tools');
  const isSearch = url.includes('web-search.local/search');
  const isArrestArticle = url.includes('20210915_arrest');
  const isArticle = (url.includes('news.narashino-online.local') || 
                    url.includes('police.pref.chiba.local') || 
                    url.includes('entame-watch.local') || 
                    url.includes('weekly-news.local') || 
                    url.includes('anime-news.local') || 
                    url.includes('movie-ranking.local')) && !isArrestArticle;
  const isPoliceSubmit = url.includes('cyber-sec.npa.go.local/submit');
  const isSakuraVet = url.includes('sakura-vet.local');
  const isDDROPPortal = url.includes('d-drop.net/portal');

  const getDDROPPublicContent = () => {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60, background: '#fff' }}>
        {/* ヒーローセクション */}
        <div style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)', borderBottom: '1px solid #d1d9e6' }}>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#1a1a2e', letterSpacing: 12, marginBottom: 20 }}>D-DROP</div>
          <div style={{ fontSize: 14, color: '#4488ff', letterSpacing: 4, marginBottom: 40, fontWeight: 'bold' }}>THE NEXT GENERATION OF DATA SOVEREIGNTY</div>
          <p style={{ fontSize: 15, color: '#555', maxWidth: 620, margin: '0 auto', lineHeight: 2 }}>
            情報の「所有」から「分散」へ。D-DROPは、既存のクラウドストレージが抱える中央集権的な脆弱性を克服し、
            絶対的な匿名性と可用性を実現する分散型アーカイブ・プラットフォームです。
          </p>
        </div>

        {/* 技術説明セクション */}
        <div style={{ padding: '60px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
            <div style={{ padding: 24, border: '1px solid #e1e8f0', background: '#f8fafc' }}>
              <div style={{ color: '#4488ff', fontWeight: 'bold', marginBottom: 12, fontSize: 14 }}>◈ 軍用レベルの暗号化</div>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
                すべてのデータはAES-256規格で暗号化された後、独自のアルゴリズムで複数のチャンクに断片化されます。
                断片化されたデータは単体では意味をなさず、全ノードからの収集と秘密鍵の照合なしには復元不可能です。
              </p>
            </div>
            <div style={{ padding: 24, border: '1px solid #e1e8f0', background: '#f8fafc' }}>
              <div style={{ color: '#4488ff', fontWeight: 'bold', marginBottom: 12, fontSize: 14 }}>◈ P2P分散ネットワーク</div>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
                特定のサーバーを持ちません。世界中のボランティア・ノードにデータが分散配置されるため、
                物理的なサーバー押収や政府による検閲、DDos攻撃によるサービス停止の影響を一切受けません。
              </p>
            </div>
          </div>

          {/* 警告/案内メッセージ */}
          <div style={{ marginTop: 50, background: '#fff9e6', border: '1px solid #ffcc00', padding: '30px', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, color: 'rgba(255,204,0,0.1)', fontWeight: 'bold', pointerEvents: 'none' }}>!</div>
            <div style={{ color: '#b38f00', fontWeight: 'bold', fontSize: 16, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
               ACCESS RESTRICTED
            </div>
            <div style={{ fontSize: 13, color: '#856a00', lineHeight: 2 }}>
              D-DROPは現在、完全招待制のプライベートネットワークとして稼働しています。<br/>
              **専用の管理ポータルおよび各アーカイブへのアクセスには、登録者ごとに発行される個別のポータルURLと認証トークンが必要です。**<br/><br/>
              新規のノード参加希望、またはアーカイブ容量の購入については、既存の紹介者を通じてのみ受け付けております。
              一般公開されているポータル以外からの不正アクセス試行は、ネットワーク全体で共有・遮断されます。
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSakuraVetContent = () => {
    return (
      <div style={{ padding: '0 0 40px 0', maxWidth: '100%', color: '#333', background: '#fff' }}>
        <div style={{ background: '#fff5f7', padding: '20px 40px', borderBottom: '3px solid #ffb7c5', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 60, height: 60, background: '#ffb7c5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32 }}>🌸</div>
          <div>
            <h1 style={{ fontSize: 24, margin: 0, color: '#d81b60' }}>さくら動物病院</h1>
            <div style={{ fontSize: 14, color: '#888' }}>Sakura Animal Hospital - あなたの大切な家族のために</div>
          </div>
        </div>
        
        <div style={{ padding: '30px 40px' }}>
          <div style={{ display: 'flex', gap: 30, marginBottom: 40 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, borderLeft: '5px solid #ffb7c5', paddingLeft: 12, marginBottom: 15 }}>お知らせ</h2>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                <div style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <span style={{ color: '#888', marginRight: 10 }}>2021.04.10</span>
                  ゴールデンウィークの診療時間について
                </div>
                <div style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <span style={{ color: '#888', marginRight: 10 }}>2021.03.25</span>
                  狂犬病予防接種の受付を開始しました
                </div>
                <div style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <span style={{ color: '#888', marginRight: 10 }}>2021.02.15</span>
                  新しくトリミング室を併設いたしました
                </div>
              </div>
            </div>
            <div style={{ width: 300, background: '#fefefe', border: '1px solid #ffb7c5', padding: 20, borderRadius: 8 }}>
              <h2 style={{ fontSize: 16, margin: '0 0 10px 0', textAlign: 'center' }}>診療時間</h2>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fff0f3' }}>
                    <th style={{ padding: 4 }}>時間</th>
                    <th style={{ padding: 4 }}>月</th>
                    <th style={{ padding: 4 }}>火</th>
                    <th style={{ padding: 4 }}>水</th>
                    <th style={{ padding: 4 }}>木</th>
                    <th style={{ padding: 4 }}>金</th>
                    <th style={{ padding: 4 }}>土</th>
                    <th style={{ padding: 4 }}>日</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                  <tr>
                    <td style={{ padding: 4, background: '#fffafa' }}>9:00-12:00</td>
                    <td>●</td><td>●</td><td>●</td><td>／</td><td>●</td><td>●</td><td>▲</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 4, background: '#fffafa' }}>16:00-19:00</td>
                    <td>●</td><td>●</td><td>●</td><td>／</td><td>●</td><td>▲</td><td>／</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: 11, color: '#666', marginTop: 10 }}>
                ●：通常診療　▲：午前のみ/予約のみ<br/>
                木曜・日曜午後は休診です。
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 18, borderLeft: '5px solid #ffb7c5', paddingLeft: 12, marginBottom: 15 }}>当院について</h2>
          <p style={{ lineHeight: 1.8, fontSize: 14 }}>
            さくら動物病院は、習志野市津田沼の地に根ざして20年。犬・猫を中心に、小鳥やハムスターなどのエキゾチックアニマルの診療も行っております。
            「病気を治す」だけでなく、飼い主様とのコミュニケーションを大切にし、予防医療や日頃のケアについても丁寧にご説明することを心がけています。
          </p>

          <div style={{ marginTop: 30, padding: 20, background: '#fafafa', borderRadius: 8 }}>
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>アクセス</h3>
            <div style={{ fontSize: 14, color: '#666' }}>
              〒275-0016 千葉県習志野市津田沼 2-17-XX<br/>
              津田沼駅南口より徒歩12分 / 駐車場5台完備
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getArticleContent = () => {
    if (url.includes('news.narashino-online.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto', color: '#333' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>社会 ＞ 事件・事故 ＞ 2021年4月14日 19:42配信</div>
          <h1 style={{ fontSize: 28, borderBottom: '2px solid #ea4335', paddingBottom: 10, marginBottom: 20 }}>【速報】習志野市津田沼で少女が行方不明 警察が情報提供呼びかけ</h1>
          <div style={{ lineHeight: 1.8, fontSize: 16 }}>
            <p>14日午後3時10分頃, 千葉県習志野市津田沼1丁目の路上で, 下校途中の小学生と見られる少女が, 黒色のワンボックスカーに強引に連れ去られる事件が発生しました。</p>
            <p>目撃者の証言によると, 犯人は男3人組と見られ, 少女を抱え込むようにして車内に押し込んだ後, 国道方面へ急発進したということです。</p>
            <p>警察は営利目的誘拐の疑いも視野に, 現場周辺の検問を強化するとともに, 目撃情報を募っています。連れ去られた少女は身長130cm前後, ピンク色のランドセルを背負っていたとのことです。</p>
            <div style={{ marginTop: 40, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
              <strong>【情報提供先】</strong><br/>
              習志野警察署 捜査第一課 特別捜査本部<br/>
              電話：047-XXX-XXXX
            </div>
          </div>
        </div>
      );
    }
    if (url.includes('police.pref.chiba.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: '#003399', color: '#fff', padding: '10px 20px', fontWeight: 'bold' }}>千葉県警察本部 ニュースリリース</div>
          <div style={{ padding: 30, border: '1px solid #003399' }}>
            <h2 style={{ color: '#d93025' }}>重要指名手配および捜査協力のお願い</h2>
            <p style={{ fontSize: 14, color: '#666' }}>掲載日：2021年4月15日</p>
            <hr/>
            <p style={{ fontWeight: 'bold' }}>習志野市における略取誘拐事案に関する捜査状況</p>
            <p style={{ fontSize: 15, lineHeight: 1.6 }}>現在, 千葉県警では習志野市内で発生した少女連れ去り事件について, 重要参考車両を公開し, 市民の皆様からの情報を求めています。</p>
            <ul style={{ lineHeight: 1.8 }}>
              <li>車種：黒色のワンボックスカー（ハイエース型）</li>
              <li>ナンバー：成田 330 X XX-XX</li>
              <li>特徴：後部ガラスが割れ, 黒いテープで補修されている</li>
            </ul>
            <p>犯人は凶器を所持している可能性があり, 発見しても決して近づかず, 直ちに110番通報してください。</p>
          </div>
        </div>
      );
    }
    if (url.includes('entame-watch.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>【悲報】人気アイドル『LUNA』解散の真相... メンバー間の確執か？</h1>
          <div style={{ marginBottom: 20 }}><img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', borderRadius: 8 }} alt="idol" /></div>
          <p style={{ lineHeight: 1.8 }}>結成10周年を迎え, 絶頂期にいた5人組アイドルグループ「LUNA」の突然の解散発表。公式には「前向きな決断」とされていますが, 関係者からはメンバー間の深刻な意見の相違があったとの声も...</p>
        </div>
      );
    }
    if (url.includes('weekly-news.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>俳優・加藤健一と人気モデル・アンナに熱愛疑惑！深夜の密会デートを激写</h1>
          <div style={{ marginBottom: 20 }}><img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', borderRadius: 8 }} alt="scandal" /></div>
          <p style={{ lineHeight: 1.8 }}>今, 最も勢いのある若手俳優の一人, 加藤健一（24）に初のスキャンダルだ。相手は人気ファッション誌の専属モデルを務めるアンナ（22）。二人は都内の高級イタリアンで食事を楽しんだ後, 加藤の運転する車で湾岸エリアへと向かった...</p>
        </div>
      );
    }
    if (url.includes('anime-news.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>新作アニメ『星屑のレクイエム』4月25日放送開始！メインキャスト解禁</h1>
          <div style={{ marginBottom: 20 }}><img src="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', borderRadius: 8 }} alt="anime" /></div>
          <p style={{ lineHeight: 1.8 }}>SFファンタジーの超大作がついにアニメ化。監督にはヒットメーカーの佐藤氏を迎え, 声優陣には今をときめく実力派たちが名を連ねる。物語は滅びゆく惑星を舞台に, 一人の少年が運命に抗う姿を描く...</p>
        </div>
      );
    }
    if (url.includes('movie-ranking.local')) {
      return (
        <div style={{ padding: '30px 40px', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>【週末動員ランキング】『桜の下の約束』がV2達成！アニメ映画も好調</h1>
          <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: 10 }}>国内映画ランキング (4/10-4/11)</h3>
            <ol style={{ lineHeight: 2, fontSize: 18 }}>
              <li><strong>桜の下の約束</strong> (公開2週目)</li>
              <li>名探偵コナンの逆襲 (公開1週目)</li>
              <li>銀河の果てまで (公開3週目)</li>
              <li>Stardust Days</li>
              <li>春の嵐</li>
            </ol>
          </div>
        </div>
      );
    }
    return <div style={{ padding: 40 }}>記事の読み込みに失敗しました。</div>;
  };

  const navigateTo = (newUrl: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUrl(newUrl);
      setInputUrl(newUrl);
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };


  const handleLogin = () => {
    if ((loginId === 'ADMIN_IRIS' && loginPw === '0429') || (loginId === 'if0e9E3dSj' && loginPw === '0429')) {
      setIsLoggedIn(true);
      setLoginUser(loginId === 'if0e9E3dSj' ? 'INTERNAL_ROOT' : 'ADMIN_IRIS');
      setLoginError(null);
    } else if (loginId === 'if0e9E3dSj' && loginPw === '1510') {
      setIsLoggedIn(true);
      setLoginUser('INTERNAL_ROOT');
      setLoginError(null);
    } else {
      setLoginError('認証エラー：IDまたはパスワードが正しくありません。');
    }
  };

  const getSearchContent = () => {
    const q = new URLSearchParams(url.split('?')[1]).get('q');
    
    if (q?.toUpperCase() === 'JOI') {
      return <JOISlotMachine />;
    }

    if (q === 'ヒント' || q === 'hint') {
      let hintText = "まずは『削除済みメール』を隅々まで読み返すのがいいかもしれません。意外なところに『数字』が隠れているはずです。";
      if (isLoggedIn) {
        hintText = "ログインに成功しましたね。完了報告書の内容をよく読み、そこに記された『場所』をシステムカレンダーで指定すれば、真実に近づけるかもしれません。";
      } else if (url.includes('tools')) {
        hintText = "ツールの認証には『電話番号』が必要です。Amazonの発送メールなどに心当たりはありませんか？";
      }

      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '20px 40px', background: '#fff9c4', border: '2px solid #fbc02d', borderRadius: 10, maxWidth: 600 }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#f57f17' }}>💡 探索のヒント</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333' }}>{hintText}</p>
          </div>
        </div>
      );
    }

    if (q === 'missing' || url.includes('行方不明')) {
      return (
        <div style={{ padding: 20, maxWidth: 800 }}>
          <div style={{ fontSize: 13, color: '#70757a', marginBottom: 20 }}>約 1,240,000 件 （0.42 秒） </div>
          {[
            { title: '【速報】習志野市津田沼で少女が行方不明 警察が情報提供呼びかけ', url: 'http://news.narashino-online.local/articles/20210414', desc: '14日午後、習志野市津田沼1丁目の路上で、下校途中の小学生と見られる少女が黒色のワンボックスカーに連れ去られる様子が目撃されました。警察は営利目的誘拐の疑いも視野に...' },
            { title: '津田沼駅周辺の監視カメラ映像を解析 犯行車両特定へ', url: 'http://police.pref.chiba.local/info/emergency', desc: '習志野警察署は、現場周辺および高速道路入り口の監視カメラ映像の解析を進めています。成田ナンバーの黒色車両が関与している可能性が高く、目撃情報を募っています。' }
          ].map((res, i) => (
            <div key={i} style={{ marginBottom: 30 }}>
              <div 
                style={{ fontSize: 20, color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer', marginBottom: 4 }}
                onClick={() => navigateTo(res.url)}
              >
                {res.title}
              </div>
              <div style={{ color: '#006621', fontSize: 14, marginBottom: 4 }}>{res.url.replace('http://', '')}</div>
              <div style={{ fontSize: 14, color: '#4d5156', lineHeight: 1.5 }}>{res.desc}</div>
            </div>
          ))}
        </div>
      );
    }

    if (q.includes('さくら') || q.includes('動物病院')) {
      return (
        <div style={{ padding: 20, maxWidth: 800 }}>
          <div style={{ fontSize: 13, color: '#70757a', marginBottom: 20 }}>約 15,200 件 （0.31 秒） </div>
          {[
            { title: 'さくら動物病院 | 習志野市津田沼の犬猫診療・トリミング', url: 'http://sakura-vet.local/', desc: '習志野市津田沼の「さくら動物病院」公式サイト。犬・猫を中心に小鳥やハムスターの診療も行っています。土日診療対応、駐車場5台。あなたの大切な家族に寄り添った医療を。' },
            { title: '習志野市の動物病院一覧 - 習志野市獣医師会', url: 'http://narashino-vets.local/list', desc: '習志野市内の動物病院マップと診療時間一覧。夜間救急対応病院の案内や、狂犬病予防接種の実施スケジュールについて掲載しています。' }
          ].map((res, i) => (
            <div key={i} style={{ marginBottom: 30 }}>
              <div 
                style={{ fontSize: 20, color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer', marginBottom: 4 }}
                onClick={() => navigateTo(res.url)}
              >
                {res.title}
              </div>
              <div style={{ color: '#006621', fontSize: 14, marginBottom: 4 }}>{res.url.replace('http://', '')}</div>
              <div style={{ fontSize: 14, color: '#4d5156', lineHeight: 1.5 }}>{res.desc}</div>
            </div>
          ))}
        </div>
      );
    }

    if (q.includes('D-DROP') || q.includes('d-drop') || q.includes('アーカイブ') || q.includes('クラウド')) {
      return (
        <div style={{ padding: 20, maxWidth: 800 }}>
          <div style={{ fontSize: 13, color: '#70757a', marginBottom: 20 }}>約 450 件 （0.28 秒） </div>
          {[
            { title: 'D-DROP | 次世代型分散アーカイブ・プラットフォーム', url: 'http://d-drop.net/', desc: 'D-DROPは、軍用レベルの暗号化とP2Pネットワークを活用した完全匿名のデータストレージです。検閲不可能な情報の避難所として、あなたのプライバシーを守ります。' },
            { title: '分散型ストレージの仕組みとメリット - テックブログ', url: 'http://tech-blog.local/distributed-storage', desc: '中央集権的なサーバーに依存しない分散型アーカイブの技術解説。データの断片化と秘密鍵による復号プロセスの重要性について。' }
          ].map((res, i) => (
            <div key={i} style={{ marginBottom: 30 }}>
              <div 
                style={{ fontSize: 20, color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer', marginBottom: 4 }}
                onClick={() => navigateTo(res.url)}
              >
                {res.title}
              </div>
              <div style={{ color: '#006621', fontSize: 14, marginBottom: 4 }}>{res.url.replace('http://', '')}</div>
              <div style={{ fontSize: 14, color: '#4d5156', lineHeight: 1.5 }}>{res.desc}</div>
            </div>
          ))}
        </div>
      );
    }

    if (q === 'entertainment' || q === 'エンタメ' || q === 'アイドル') {
      return (
        <div style={{ padding: 20, maxWidth: 800 }}>
          <div style={{ fontSize: 13, color: '#70757a', marginBottom: 20 }}>約 8,500,000 件 （0.35 秒） </div>
          {[
            { title: '人気アイドルグループ『LUNA』が電撃解散を発表 結成10周年の節目に', url: 'http://entame-watch.local/news/2104', desc: '5人組アイドルグループ「LUNA」が公式サイトで解散を発表しました。メンバーそれぞれの道へ進むための前向きな決断としており、5月にはラストライブを予定...' },
            { title: '俳優・加藤健一とモデルの熱愛発覚？ 深夜のドライブデートが激写される', url: 'http://weekly-news.local/scoop/kato', desc: '若手実力派俳優の加藤健一（24）と, 人気ファッションモデルのアンナ（22）の親密な様子が週刊誌によって報じられました。二人は都内のイタリアンレストランで食事をした後...' },
            { title: '新作アニメ『星屑のレクイエム』放送開始日が決定 豪華声優陣も発表', url: 'http://anime-news.local/2021spring', desc: '待望のオリジナルアニメ『星屑のレクイエム』が4月25日より放送開始されることが分かりました。メインキャストには実力派の面々が揃い、早くもファンの間で期待が高まって...' },
            { title: '春の新作映画ランキング 『桜の下の約束』が初登場1位を記録', url: 'http://movie-ranking.local/weekly', desc: '先週末の興行収入ランキングが発表され, 人気小説を実写化した恋愛映画『桜の下の約束』が圧倒的な数字で首位を獲得しました。' }
          ].map((res, i) => (
            <div key={i} style={{ marginBottom: 30 }}>
              <div 
                style={{ fontSize: 20, color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer', marginBottom: 4 }}
                onClick={() => navigateTo(res.url)}
              >
                {res.title}
              </div>
              <div style={{ color: '#006621', fontSize: 14, marginBottom: 4 }}>{res.url.replace('http://', '')}</div>
              <div style={{ fontSize: 14, color: '#4d5156', lineHeight: 1.5 }}>{res.desc}</div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: '#70757a' }}>「{q}」に一致する情報は見つかりませんでした。</p>
        <p style={{ fontSize: 14, color: '#4d5156', marginTop: 20 }}>ヒント: 習志野市のトレンドワード（行方不明、エンタメ、アイドルなど）を検索してみてください。</p>
      </div>
    );
  };

  const navigateToSearch = (query: string) => {
    const searchUrl = `http://web-search.local/search?q=${encodeURIComponent(query)}`;
    navigateTo(searchUrl);
  };

  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const startDownload = (fileId: string) => {
    setDownloadingFile(fileId);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFile(null);
            onDownload?.(fileId);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f0', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      {/* Download Modal */}
      {downloadingFile && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: 400, background: '#ece9d8', border: '1px solid #0055e0', borderRadius: '5px 5px 0 0', boxShadow: '5px 5px 15px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to right, #1f5fc7 0%, #3a7bc8 100%)', padding: '5px 10px', color: '#fff', fontSize: 12, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>D-DROP Decryptor をダウンロードしています...</span>
              <X size={14} onClick={() => setDownloadingFile(null)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                <RefreshCw className="animate-spin" size={32} color="#0055e0" />
                <div style={{ fontSize: 12 }}>
                  <strong>{downloadingFile === 'maintenance' ? 'D-DROP Decryptor' : 'Unknown File'}</strong> を保存しています。<br/>
                  コピー先: C:\Documents and Settings\Administrator\Desktop
                </div>
              </div>
              <div style={{ height: 20, background: '#fff', border: '1px solid #7f9db9', position: 'relative' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${downloadProgress}%`, 
                  background: 'linear-gradient(to bottom, #76b9f7 0%, #3596f3 50%, #1e4db1 100%)',
                  transition: 'width 0.1s linear'
                }} />
              </div>
              <div style={{ textAlign: 'right', marginTop: 10, fontSize: 11 }}>{downloadProgress}% 完了</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                <button onClick={() => setDownloadingFile(null)} style={{ padding: '5px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12 }}>キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: '5px 10px', background: '#ece9d8', borderBottom: '1px solid #aca899', display: 'flex', gap: 5, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <div 
            style={{ width: 24, height: 24, background: historyIndex > 0 ? '#fff' : '#f0f0f0', border: '1px solid #aca899', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: historyIndex > 0 ? 'pointer' : 'default', opacity: historyIndex > 0 ? 1 : 0.5 }} 
            onClick={handleBack}
          >
            <ArrowLeft size={16} color={historyIndex > 0 ? "#000" : "#aca899"} />
          </div>
          <div 
            style={{ width: 24, height: 24, background: historyIndex < history.length - 1 ? '#fff' : '#f0f0f0', border: '1px solid #aca899', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: historyIndex < history.length - 1 ? 'pointer' : 'default', opacity: historyIndex < history.length - 1 ? 1 : 0.5 }}
            onClick={handleForward}
          >
            <ArrowRight size={16} color={historyIndex < history.length - 1 ? "#000" : "#aca899"} />
          </div>
        </div>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', gap: 2 }}>
          <div style={{ background: '#fff', border: '1px solid #7f9db9', flex: 1, display: 'flex', alignItems: 'center', padding: '2px 5px' }}>
            <Globe size={14} color="#0055e0" style={{ marginRight: 5 }} />
            <input 
              value={inputUrl} 
              onChange={e => setInputUrl(e.target.value)} 
              style={{ border: 'none', width: '100%', outline: 'none', fontSize: 12 }} 
            />
          </div>
          <button type="submit" style={{ padding: '2px 10px', background: '#ece9d8', border: '1px solid #aca899', fontSize: 11 }}>移動</button>
        </form>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#fff', position: 'relative', overflowX: 'hidden' }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <RefreshCw className="animate-spin" size={32} color="#0055e0" />
          </div>
        )}

        {isSearch ? (
          <div style={{ height: '100%' }}>
            <div style={{ borderBottom: '1px solid #ebebeb', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 30 }}>
              <div 
                style={{ fontSize: 24, fontWeight: 'bold', cursor: 'pointer', display: 'flex' }}
                onClick={() => navigateTo('http://msn.local/')}
              >
                <span style={{ color: '#4285F4' }}>I</span>
                <span style={{ color: '#EA4335' }}>r</span>
                <span style={{ color: '#FBBC05' }}>i</span>
                <span style={{ color: '#4285F4' }}>s</span>
              </div>
              <form 
                style={{ flex: 1, maxWidth: 600, height: 38, border: '1px solid #dfe1e5', borderRadius: 24, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', padding: '0 15px' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.target as HTMLFormElement).querySelector('input')?.value;
                  if (q) navigateToSearch(q);
                }}
              >
                <input 
                  defaultValue={new URLSearchParams(url.split('?')[1]).get('q') || ''}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14 }}
                />
              </form>
            </div>
            {getSearchContent()}
          </div>
        ) : isArrestArticle ? (
          <div style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', padding: '30px 40px' }}>
              {/* ニュースサイトヘッダー */}
              <div style={{ borderBottom: '3px solid #1a1a1a', paddingBottom: 10, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#888' }}>社会 › 事件 › 逮捕</div>
                <h1 style={{ fontSize: 24, lineHeight: 1.4, margin: '10px 0', color: '#111' }}>
                  【逮捕】習志野市誘拐事件 容疑者グループを一斉検挙 犯行拠点から少女を保護
                </h1>
                <div style={{ fontSize: 12, color: '#666', display: 'flex', gap: 20 }}>
                  <span>2021年9月15日 11:24 配信</span>
                  <span>習志野新聞オンライン</span>
                </div>
              </div>

              <div style={{ lineHeight: 1.9, fontSize: 15, color: '#222' }}>
                <p style={{ marginBottom: 16 }}>
                  千葉県警察および警察庁サイバー犯罪対策課は15日、4月に発生した習志野市津田沼における誘拐事件の容疑者グループ3名を組織犯罪処罰法違反および営利目的誘拐の疑いで一斉逮捕した。
                </p>
                <p style={{ marginBottom: 16 }}>
                  逮捕されたのは住所不定・無職の佐藤裕也容疑者（32）ほか2名。警察によれば、今年4月10日に習志野市内の路上で被害女児（10）を拉致し、津田沼のアパート302号室に監禁した上、身代金1億2000万円を要求していたとされる。
                </p>
                <p style={{ marginBottom: 16 }}>
                  事件の解決のきっかけとなったのは、<strong>市民からの電子的な情報提供</strong>だった。容疑者グループが使用していた暗号化通信システム内に残されていた犯行記録ログが、警察庁の分析システムに提出されたことで、グループの実態と拠点が特定されたという。
                </p>
                <p style={{ marginBottom: 16 }}>
                  捜索の結果、拠点アパートから被害女児は無事保護された。健康状態に問題はないとされているが、精神的なケアが必要なため、医療機関のもとで保護・支援が行われている。
                </p>
                <p style={{ marginBottom: 16 }}>
                  警察庁は「デジタル証拠を適切に提供していただいた市民の方々のご協力が、今回の解決につながった。引き続き、不審なデジタルデータを発見した際は当局に提供していただきたい」とコメントを発表している。
                </p>
                <div style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '16px 20px', borderRadius: 4, marginTop: 24 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 13 }}>逮捕者情報（3名）</div>
                  <div style={{ fontSize: 13, color: '#444', lineHeight: 2 }}>
                    ・ 佐藤裕也（32）住所不定・無職　※拠点提供・主犯格<br/>
                    ・ K.Suzuki（39）住所不定　※指示役<br/>
                    ・ M.Tanaka（28）住所不定　※見張り役・車両手配
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isArticle ? (
          <div style={{ height: '100%', background: '#fff' }}>
            {getArticleContent()}
          </div>
        ) : isTools ? (
          <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 20 }}>D-DROP SYSTEM TOOLS</h1>
            <p style={{ marginBottom: 30 }}>サーバー管理および機密アーカイブ閲覧用のツールをダウンロードできます。</p>
            
            <div style={{ border: '1px solid #ccc', padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #999' }}>
                <Monitor size={32} color="#666" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>D-DROP Decryptor</div>
                <div style={{ fontSize: 12, color: '#666' }}>Version 1.0.4 (Security Update)</div>
              </div>
              <button 
                onClick={() => {
                  onDownload?.('maintenance');
                }}
                style={{ padding: '10px 20px', background: '#0055e0', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
              >
                ダウンロード
              </button>
            </div>
          </div>
        ) : isPoliceSubmit ? (
          <div style={{ background: '#f8f9fa', minHeight: '100%', color: '#333', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#003366', color: '#fff', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldAlert size={24} /> 警視庁 証拠提出システム (NPA-PORTAL)
              </div>
              <div style={{ fontSize: 12 }}>セキュリティレベル: 高</div>
            </div>
            <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
              {analysisState === 'idle' && (
                <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 40, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 24, marginBottom: 20, borderBottom: '2px solid #003366', paddingBottom: 10 }}>
                    情報提供・証拠提出フォーム
                  </h2>
                  <p style={{ lineHeight: 1.6, marginBottom: 30 }}>
                    本システムは、習志野市における略取誘拐事件に関連するデジタル証拠を収集するための専用ポータルです。
                    解析済みの犯罪記録や、犯行グループの身元を示すログデータをお持ちの場合は、速やかに提出してください。
                  </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>容疑者氏名:</label>
                    <input 
                      type="text" 
                      value={suspectName} 
                      onChange={e => setSuspectName(e.target.value)}
                      placeholder="例：山田 太郎"
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>事件に関連する重要拠点（犯行現場・監禁場所など）の住所:</label>
                    <input 
                      type="text" 
                      value={suspectAddress} 
                      onChange={e => setSuspectAddress(e.target.value)}
                      placeholder="例：千葉県習志野市..."
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>証拠ファイル (.txt / .log):</label>
                    <div 
                      onClick={() => setShowFilePicker(true)}
                      style={{ background: selectedFileName ? '#e6ffe6' : '#f0f4f8', border: `2px dashed ${selectedFileName ? '#008000' : '#003366'}`, borderRadius: 8, padding: 30, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                      <div style={{ fontSize: 14, color: selectedFileName ? '#008000' : '#003366', fontWeight: 'bold' }}>
                        {selectedFileName ? `✅ ${selectedFileName} が添付されています` : "クリックしてPC内からファイルを選択"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 仮想エクスプローラーモーダル (XP風) */}
                {showFilePicker && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#ece9d8', border: '1px solid #0055ea', width: 600, height: 400, boxShadow: '2px 2px 10px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif' }}>
                      {/* タイトルバー */}
                      <div style={{ background: 'linear-gradient(90deg, #0058e6, #3a93ff)', padding: '5px 10px', color: '#fff', fontWeight: 'bold', fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Folder size={14} fill="#ffcc00" color="#c09030" />
                          <span>ファイルの選択</span>
                        </div>
                        <button onClick={() => setShowFilePicker(false)} style={{ background: '#e04343', border: '1px solid #fff', color: '#fff', cursor: 'pointer', borderRadius: 3, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>×</button>
                      </div>
                      
                      {/* ツールバー */}
                      <div style={{ padding: '2px 5px', borderBottom: '1px solid #7f9db9', display: 'flex', alignItems: 'center', gap: 10, background: '#ece9d8' }}>
                        <div style={{ display: 'flex', gap: 2, borderRight: '1px solid #ccc', paddingRight: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', opacity: 0.5 }}>
                            <div style={{ background: '#245edb', borderRadius: '50%', padding: 2 }}><ArrowLeft size={12} color="#fff" /></div><span style={{ fontSize: 11 }}>戻る</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', opacity: 0.5 }}>
                            <div style={{ background: '#245edb', borderRadius: '50%', padding: 2 }}><ArrowRight size={12} color="#fff" /></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#333' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Search size={14} color="#4060b0" /> 検索</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Folder size={14} fill="#ffcc00" color="#c09030" /> フォルダ</div>
                        </div>
                      </div>

                      {/* アドレスバー */}
                      <div style={{ padding: '3px 8px', borderBottom: '1px solid #7f9db9', display: 'flex', alignItems: 'center', gap: 5, background: '#ece9d8' }}>
                        <span style={{ fontSize: 11, color: '#666' }}>アドレス(A)</span>
                        <div style={{ background: '#fff', border: '1px solid #7f9db9', flex: 1, padding: '2px 5px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Folder size={12} fill="#ffcc00" color="#c09030" />
                          <span>C:\Documents and Settings\Sato\{pickerFolder === 'desktop' ? 'デスクトップ' : pickerFolder === 'documents' ? 'マイ ドキュメント' : pickerFolder === 'pictures' ? 'マイ ピクチャ' : 'マイ ミュージック'}</span>
                          <div style={{ flex: 1 }} />
                          <ChevronDown size={12} color="#999" />
                        </div>
                      </div>

                      {/* メインエリア */}
                      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#fff' }}>
                        {/* 左サイドバー */}
                        <div style={{ width: 160, background: '#7ba2e7', padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ background: '#fff', borderRadius: 3, overflow: 'hidden', border: '1px solid #fff' }}>
                            <div style={{ background: 'linear-gradient(to right, #fff, #c6d3f7)', padding: '4px 8px', fontSize: 11, fontWeight: 'bold', color: '#003399', borderBottom: '1px solid #fff' }}>場所</div>
                            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div onClick={() => setPickerFolder('desktop')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#003399', cursor: 'pointer', fontWeight: pickerFolder === 'desktop' ? 'bold' : 'normal' }}><Monitor size={14} color="#4060b0" /> <span>デスクトップ</span></div>
                              <div onClick={() => setPickerFolder('documents')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#003399', cursor: 'pointer', fontWeight: pickerFolder === 'documents' ? 'bold' : 'normal' }}><MonitorPlay size={14} color="#4060b0" /> <span>マイ ドキュメント</span></div>
                              <div onClick={() => setPickerFolder('pictures')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#003399', cursor: 'pointer', fontWeight: pickerFolder === 'pictures' ? 'bold' : 'normal' }}><ImageIcon size={14} color="#4060b0" /> <span>マイ ピクチャ</span></div>
                              <div onClick={() => setPickerFolder('music')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#003399', cursor: 'pointer', fontWeight: pickerFolder === 'music' ? 'bold' : 'normal' }}><Music size={14} color="#4060b0" /> <span>マイ ミュージック</span></div>
                            </div>
                          </div>
                        </div>

                        {/* ファイルリスト */}
                        <div style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 10, padding: 15 }}>
                            {files
                              .filter(f => (pickerFolder === 'desktop' ? (f.folder === 'desktop' || !f.folder) : f.folder === pickerFolder))
                              .map((f) => (
                                <div 
                                  key={f.id} 
                                  onClick={() => setSelectedFileName(f.name)}
                                  style={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
                                    padding: 5, borderRadius: 3, border: selectedFileName === f.name ? '1px solid #7f9db9' : '1px solid transparent',
                                    background: selectedFileName === f.name ? '#e5f3ff' : 'transparent'
                                  }}
                                >
                                  {f.type === 'image' ? <ImageIcon size={32} color="#4a90e2" /> :
                                   f.type === 'video' ? <FileVideo size={32} color="#e91e63" /> :
                                   f.type === 'audio' ? <FileAudio size={32} color="#9c27b0" /> :
                                   f.type === 'trash' ? <Trash2 size={32} color="#666" /> :
                                   <FileText size={32} color="#999" />}
                                  <span style={{ fontSize: 10, textAlign: 'center', wordBreak: 'break-all', color: '#000' }}>{f.name}</span>
                                </div>
                              ))
                            }
                            {files.filter(f => (pickerFolder === 'desktop' ? (f.folder === 'desktop' || !f.folder) : f.folder === pickerFolder)).length === 0 && (
                              <div style={{ padding: 20, color: '#999', fontSize: 12 }}>フォルダは空です</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* フッター (ファイル名入力) */}
                      <div style={{ padding: '10px 15px', background: '#ece9d8', borderTop: '1px solid #7f9db9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, width: 90, textAlign: 'right' }}>ファイル名(N):</span>
                          <input type="text" readOnly value={pickerFolder === 'desktop' && hasEvidenceFile ? "operation_report_0415.txt" : ""} style={{ flex: 1, padding: '3px 5px', border: '1px solid #7f9db9', fontSize: 11 }} />
                          <button onClick={() => {
                            if(pickerFolder === 'desktop' && hasEvidenceFile) {
                              setSelectedFileName('operation_report_0415.txt');
                              setShowFilePicker(false);
                            }
                          }} style={{ width: 80, padding: '3px', fontSize: 11, background: '#ece9d8', border: '1px solid #7f9db9' }}>開く(O)</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, width: 90, textAlign: 'right' }}>ファイルの種類(T):</span>
                          <select style={{ flex: 1, padding: '3px 5px', border: '1px solid #7f9db9', fontSize: 11 }}>
                            <option>すべてのファイル (*.*)</option>
                            <option>テキスト ドキュメント (*.txt)</option>
                          </select>
                          <button onClick={() => setShowFilePicker(false)} style={{ width: 80, padding: '3px', fontSize: 11, background: '#ece9d8', border: '1px solid #7f9db9' }}>キャンセル</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    const normName = normalizeText(suspectName);
                    const normAddr = normalizeText(suspectAddress);
                    
                    if (!normName || !normAddr || !selectedFileName) {
                      setShowXPDialog('未入力の項目があります。\n証拠ファイルを選択し、すべての項目を入力してください。');
                      return;
                    }

                    setAnalysisState('analyzing');

                    setTimeout(() => {
                      const isNameCorrect = normName === '佐藤裕也';
                      const isAddrCorrect = normAddr.includes('メゾン津田沼') && (normAddr.includes('302') || normAddr.includes('2171'));
                      const isFileCorrect = selectedFileName === 'operation_report_0415.txt';

                      if (isNameCorrect && isAddrCorrect && isFileCorrect) {
                        setAnalysisState('success');
                        setTimeout(() => {
                          navigateTo('http://news.narashino-online.local/articles/20210915_arrest');
                          setTimeout(() => {
                            if (onTrueEndClear) onTrueEndClear();
                          }, 15000); // 15秒後にTrue Endのオーバーレイを表示
                        }, 3000);
                      } else {
                        setAnalysisState('failed');
                        let feedback = '提供されたデータの信頼性を確認できませんでした。\n以下の点に不備がある可能性があります：\n\n';
                        if (!isFileCorrect) feedback += '・添付されたファイルが、事件の実行や関係性を示す決定的な「証拠」として不十分です。\n';
                        if (!isNameCorrect) feedback += '・容疑者の「氏名」が、関連データと一致しません。\n';
                        if (!isAddrCorrect) feedback += '・指定された「重要拠点」の住所が、証拠や裏付け情報と一致しません。\n';
                        
                        setAnalysisFeedback(feedback);
                      }
                    }, 4000);
                  }}
                  disabled={(analysisState as string) === 'analyzing'}
                  style={{ width: '100%', padding: '15px', background: (analysisState as string) === 'analyzing' ? '#666' : '#003366', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: (analysisState as string) === 'analyzing' ? 'not-allowed' : 'pointer', marginTop: 20 }}
                >
                  {(analysisState as string) === 'analyzing' ? '分析中...' : '情報を送信して分析を開始する'}
                </button>

                <div style={{ marginTop: 40, padding: 20, borderLeft: '4px solid #ffcc00', background: '#fff9e6', fontSize: 13 }}>
                  <strong>注意:</strong> 提供された情報は捜査のためにのみ使用され、提供者の秘匿性は厳重に守られます。
                  虚偽の報告は捜査を妨害する行為として罰せられる可能性があります。
                </div>
              </div>
            )}

            {/* XP スタイルのダイアログ */}
            {showXPDialog && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{ width: 320, background: '#ece9d8', border: '1px solid #0055e0', boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', fontFamily: 'Tahoma, sans-serif' }}>
                  <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '3px 8px', fontSize: 11, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>証拠提出ポータル</span>
                    <button onClick={() => setShowXPDialog(null)} style={{ width: 16, height: 16, background: '#e04343', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', fontSize: 9, cursor: 'pointer', borderRadius: 2 }}>×</button>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, background: '#0055e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18, flexShrink: 0 }}>!</div>
                    <div style={{ fontSize: 12, color: '#000', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{showXPDialog}</div>
                  </div>
                  <div style={{ padding: '0 20px 14px', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => setShowXPDialog(null)} style={{ padding: '3px 24px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12, cursor: 'pointer', boxShadow: '1px 1px 0 #fff inset' }}>OK</button>
                  </div>
                </div>
              </div>
            )}

          {/* AI分析中画面 */}
          {analysisState === 'analyzing' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a1628', color: '#fff', fontFamily: 'monospace', overflow: 'hidden' }}>
              {/* ヘッダー */}
              <div style={{ background: 'linear-gradient(to right, #003399, #0055cc)', padding: '12px 20px', borderBottom: '2px solid #4488ff', display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldAlert size={20} color="#66aaff" />
                <span style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 1, color: '#cce0ff' }}>NPA-AI 証拠分析システム v3.2</span>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: '#88aacc' }}>CASE-ID: 2021-NRH-0042</div>
              </div>

              {/* メインエリア */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, gap: 30 }}>
                {/* 回転レーダー風インジケーター */}
                <div style={{ position: 'relative', width: 100, height: 100 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '2px solid rgba(68,136,255,0.3)',
                    boxShadow: '0 0 20px rgba(68,136,255,0.2)'
                  }} />
                  <div style={{
                    position: 'absolute', inset: 8, borderRadius: '50%',
                    border: '2px solid rgba(68,136,255,0.5)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#4488ff',
                    borderRightColor: '#4488ff',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div style={{
                    position: 'absolute', inset: '50%', width: 2, height: '45%',
                    background: 'linear-gradient(to top, #4488ff, transparent)',
                    transformOrigin: 'bottom center',
                    animation: 'spin 2s linear infinite',
                    transform: 'translateX(-50%)'
                  }} />
                  <ShieldAlert size={24} color="#4488ff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#cce0ff', marginBottom: 6, letterSpacing: 1 }}>証拠データを分析中...</div>
                  <div style={{ fontSize: 12, color: '#6699cc' }}>NPA Criminal Investigation AI — Analyzing submission</div>
                </div>

                {/* ログ表示エリア */}
                <div style={{
                  width: '100%', maxWidth: 480, background: 'rgba(0,30,80,0.6)',
                  border: '1px solid #1a4080', borderRadius: 6, padding: 16, fontFamily: 'monospace'
                }}>
                  <div style={{ fontSize: 10, color: '#446688', marginBottom: 8, borderBottom: '1px solid #1a4080', paddingBottom: 6 }}>[ SYSTEM LOG ]</div>
                  {[
                    { text: '受信データのパケット展開...', delay: 0, status: 'OK' },
                    { text: 'メタデータの整合性チェック...', delay: 0.5, status: 'OK' },
                    { text: '証拠ファイルのハッシュ照合...', delay: 1.0, status: 'CHECKING' },
                    { text: '人物データベースとのクロスチェック...', delay: 1.5, status: 'CHECKING' },
                    { text: '地理情報の裏付け検証...', delay: 2.0, status: 'PENDING' },
                    { text: '最終判定フェーズへ移行...', delay: 2.5, status: 'PENDING' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 11, opacity: 0.85 }}>
                      <span style={{ color: item.status === 'OK' ? '#44cc88' : item.status === 'CHECKING' ? '#4488ff' : '#445566', minWidth: 8 }}>
                        {item.status === 'OK' ? '✓' : item.status === 'CHECKING' ? '▶' : '○'}
                      </span>
                      <span style={{ color: item.status === 'OK' ? '#88ccaa' : item.status === 'CHECKING' ? '#aaccff' : '#446677', flex: 1 }}>{item.text}</span>
                      <span style={{ fontSize: 10, color: item.status === 'OK' ? '#44cc88' : item.status === 'CHECKING' ? '#4488ff' : '#334455', fontWeight: 'bold' }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* プログレスバー */}
                <div style={{ width: '100%', maxWidth: 480 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#6699cc' }}>
                    <span>分析進捗</span>
                    <span>処理中...</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(68,136,255,0.15)', borderRadius: 3, overflow: 'hidden', border: '1px solid #1a4080' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(to right, #1155cc, #4488ff)',
                      width: '0%',
                      animation: 'progressFill 3s ease-out forwards'
                    }} />
                  </div>
                </div>
              </div>

              {/* フッター */}
              <div style={{ background: 'rgba(0,20,60,0.8)', borderTop: '1px solid #1a3060', padding: '8px 20px', fontSize: 10, color: '#446688', display: 'flex', justifyContent: 'space-between' }}>
                <span>警視庁 サイバー犯罪対策課 © 2021</span>
                <span>SSL/TLS 暗号化通信</span>
              </div>
            </div>
          )}

          <style>{`
            @keyframes progressFlow {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(50%); }
              100% { transform: translateX(200%); }
            }
          `}</style>

          {/* AI分析完了（成功）画面 */}
          {analysisState === 'success' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a1628', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(to right, #003399, #0055cc)', padding: '12px 20px', borderBottom: '2px solid #4488ff', display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldAlert size={20} color="#66aaff" />
                <span style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 1, color: '#cce0ff' }}>NPA-AI 証拠分析システム v3.2</span>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: '#88aacc' }}>CASE-ID: 2021-NRH-0042</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, gap: 20 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0044aa, #0077ee)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(68,136,255,0.5), 0 0 60px rgba(68,136,255,0.2)',
                  border: '2px solid #4488ff'
                }}>
                  <ShieldAlert size={36} color="#cce0ff" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 'bold', color: '#4488ff', marginBottom: 8, letterSpacing: 1 }}>分析完了 — データが確認されました</div>
                  <div style={{ fontSize: 13, color: '#88aacc', lineHeight: 1.7, maxWidth: 460 }}>
                    提供された証拠ファイルおよび対象者情報が、<br/>
                    2021年発生の習志野市誘拐事案と<span style={{ color: '#4488ff', fontWeight: 'bold' }}>完全に一致</span>しました。<br/><br/>
                    これより警察庁特捜班による強制捜査を開始します。<br/>
                    ご協力ありがとうございました。
                  </div>
                </div>
                <div style={{ padding: '12px 24px', background: 'rgba(68,136,255,0.1)', border: '1px solid #1a4080', borderRadius: 6, fontSize: 12, color: '#6699cc', textAlign: 'center' }}>
                  <span style={{ color: '#44cc88' }}>✓</span> 情報はセキュアチャンネルを通じて受理されました
                </div>
              </div>
              <div style={{ background: 'rgba(0,20,60,0.8)', borderTop: '1px solid #1a3060', padding: '8px 20px', fontSize: 10, color: '#446688', display: 'flex', justifyContent: 'space-between' }}>
                <span>警視庁 サイバー犯罪対策課 © 2021</span>
                <span>SSL/TLS 暗号化通信</span>
              </div>
            </div>
          )}

          {/* AI分析失敗画面 */}
          {analysisState === 'failed' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a1628', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(to right, #003399, #0055cc)', padding: '12px 20px', borderBottom: '2px solid #cc3333', display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldAlert size={20} color="#ff6666" />
                <span style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 1, color: '#ffcccc' }}>NPA-AI 証拠分析システム v3.2 — 判定エラー</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, gap: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #550000, #990000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(200,50,50,0.4)',
                  border: '2px solid #cc3333'
                }}>
                  <X size={32} color="#ffaaaa" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6666', marginBottom: 6, letterSpacing: 1 }}>信頼性評価：不十分</div>
                  <div style={{ fontSize: 12, color: '#997777' }}>提出された情報に不備が検出されました</div>
                </div>
                <div style={{
                  width: '100%', maxWidth: 440,
                  background: 'rgba(80,0,0,0.3)', border: '1px solid #661a1a',
                  borderRadius: 6, padding: 16, fontSize: 12, color: '#cc9999',
                  lineHeight: 1.8, whiteSpace: 'pre-wrap'
                }}>
                  {analysisFeedback}
                </div>
                <button 
                  onClick={() => setAnalysisState('idle')}
                  style={{ padding: '10px 30px', background: 'linear-gradient(to bottom, #1a3a8a, #0f2060)', color: '#cce0ff', border: '1px solid #2255aa', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}
                >
                  入力フォームへ戻る
                </button>
              </div>
              <div style={{ background: 'rgba(0,20,60,0.8)', borderTop: '1px solid #1a3060', padding: '8px 20px', fontSize: 10, color: '#446688', display: 'flex', justifyContent: 'space-between' }}>
                <span>警視庁 サイバー犯罪対策課 © 2021</span>
                <span>SSL/TLS 暗号化通信</span>
              </div>
            </div>
          )}
          </div>
        </div>
        ) : isSakuraVet ? (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {getSakuraVetContent()}
          </div>
        ) : isDDROP ? (
          <div style={{ background: '#f4f7f9', minHeight: '100%', color: '#334', fontFamily: "'Courier New', monospace", display: 'flex', flexDirection: 'column' }}>
            {/* D-DROP ヘッダー */}
            <div style={{ background: 'linear-gradient(to right, #ffffff, #e9eff5)', borderBottom: '1px solid #d1d9e6', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, border: '1px solid #4488ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#4488ff', fontWeight: 'bold' }}>◈</div>
              <span style={{ fontSize: 13, letterSpacing: 3, color: '#1a1a2e', fontWeight: 'bold' }}>D-DROP</span>
              <span style={{ fontSize: 10, color: '#88a', marginLeft: 4 }}>v2.4.1 / PRIVATE_NODE</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
            {!isDDROPPortal ? (
              getDDROPPublicContent()
            ) : !isLoggedIn ? (
              <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px' }}>
                <div style={{ border: '1px solid #d1d9e6', padding: '28px 24px', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 11, letterSpacing: 4, color: '#4488ff', marginBottom: 24, textAlign: 'center', fontWeight: 'bold' }}>AUTHENTICATION REQUIRED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                      placeholder="LOGIN ID"
                      value={loginId} onChange={e => setLoginId(e.target.value)}
                      style={{ background: '#f8fafc', color: '#333', border: '1px solid #d1d9e6', padding: '10px 12px', outline: 'none', fontSize: 12, letterSpacing: 1 }}
                    />
                    <input
                      type="password" placeholder="PASSWORD"
                      value={loginPw} onChange={e => setLoginPw(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      style={{ background: '#f8fafc', color: '#333', border: '1px solid #d1d9e6', padding: '10px 12px', outline: 'none', fontSize: 12, letterSpacing: 1 }}
                    />
                    {loginError && <div style={{ color: '#e53e3e', fontSize: 11 }}>{loginError}</div>}
                    <button
                      onClick={handleLogin}
                      style={{ marginTop: 12, background: '#4488ff', color: '#fff', border: 'none', padding: '10px', fontSize: 12, cursor: 'pointer', letterSpacing: 2, fontWeight: 'bold' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#3366cc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#4488ff'}
                    >ENTER</button>
                  </div>
                </div>
              </div>
            ) : !showReport ? (
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 11, color: '#88a', marginBottom: 20 }}>
                  SESSION: {loginUser === 'INTERNAL_ROOT' ? 'ROOT' : 'USER'} / {new Date().toISOString().slice(0,10)}
                </div>
                <div style={{ fontSize: 12, color: '#4488ff', marginBottom: 16, letterSpacing: 1, fontWeight: 'bold' }}>ARCHIVE INDEX</div>
                {loginUser === 'INTERNAL_ROOT' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div
                      onClick={() => { setShowReport(true); onReportViewed(); }}
                      style={{ padding: '12px 16px', border: '1px solid #d1d9e6', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <Lock size={13} color="#4488ff" />
                      <span style={{ color: '#333' }}>evidence_302_location.enc</span>
                      <span style={{ marginLeft: 'auto', color: '#4488ff', fontSize: 10, fontWeight: 'bold' }}>DECRYPTABLE</span>
                    </div>
                    <div style={{ padding: '12px 16px', border: '1px solid #e1e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, opacity: 0.5 }}>
                      <Lock size={13} color="#88a" />
                      <span style={{ color: '#88a' }}>surveillance_video_backup.mp4</span>
                      <span style={{ marginLeft: 'auto', color: '#88a', fontSize: 10 }}>LOCKED</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => { setShowReport(true); onReportViewed(); }}
                    style={{ padding: '12px 16px', border: '1px solid #d1d9e6', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <span style={{ color: '#4488ff', fontSize: 10 }}>▶</span>
                    <span style={{ color: '#333' }}>20210415_完了報告書.log</span>
                    <span style={{ marginLeft: 'auto', color: '#88a', fontSize: 10 }}>2021-04-15</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ lineHeight: 1.8, fontSize: 12, padding: 24 }}>
                {loginUser === 'INTERNAL_ROOT' ? (
                  <>
                    <div style={{ color: '#4488ff', fontSize: 11, marginBottom: 16, borderBottom: '1px solid #d1d9e6', paddingBottom: 8, fontWeight: 'bold' }}>evidence_302_location.enc — DECRYPTED</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderBottom: '1px dashed #d1d9e6', paddingBottom: 24, fontSize: 13, color: '#333' }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ STATUS ]</span>
                        <span style={{ color: '#333' }}>SECURED — 指定ポイント（302号室）に対象を拘禁中</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ LOCATION ]</span>
                        <span style={{ color: '#333' }}>千葉県習志野市津田沼 廃ビル 3F-302</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ TARGET ]</span>
                        <span style={{ color: '#333' }}>身代金目的。要求額1億2000万。交渉は難航中。</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ DIRECTIVE ]</span>
                        <span style={{ color: '#333' }}>監視カメラログを定期消去し、痕跡を完全に抹消せよ。</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ NOTES 1 ]</span>
                        <span style={{ color: '#555', lineHeight: 1.8 }}>
                          近隣住民からの通報リスクは低い。防音処理は済んでいる。<br/>
                          ただし、警察のサイバー班が通信の痕跡を追っている可能性がある。<br/>
                          D-DROPのアクセスログは毎日24時に自動で上書き消去すること。
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ NOTES 2 ]</span>
                        <span style={{ color: '#e53e3e', lineHeight: 1.8, fontWeight: 'bold' }}>
                          現在も監視カメラが作動中。<br/>
                          2026年の今日でも、彼女はそこに囚われたまだ。<br/>
                          この記録が残っている以上、証拠は消えない。
                        </span>
                      </div>
                    </div>
                    
                    {ddropDownloadState === 'downloading' && (
                      <div style={{ marginTop: 30, background: '#f0f7ff', border: '1px solid #4488ff', padding: '16px', borderRadius: 4 }}>
                        <div style={{ fontSize: 13, color: '#4488ff', marginBottom: 12, fontWeight: 'bold' }}>DETECTED UNUSUAL NETWORK ACTIVITY... DOWNLOADING HIDDEN PAYLOAD...</div>
                        <div style={{ height: 4, background: '#e1e8f0', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#4488ff', width: '0%', animation: 'progressFill 0.5s linear forwards' }} />
                        </div>
                      </div>
                    )}
                    
                    {ddropDownloadState === 'complete' && (
                      <div style={{ marginTop: 30, color: '#38a169', fontSize: 13, textAlign: 'center', fontWeight: 'bold', padding: '16px', border: '1px dashed #38a169', background: '#f0fff4' }}>
                        [ ✓ ] SECURE PAYLOAD HAS BEEN EXTRACTED TO LOCAL DESKTOP.
                      </div>
                    )}

                    <div style={{ marginTop: 30, textAlign: 'center' }}>
                      <button onClick={() => { setShowReport(false); setDdropDownloadState('idle'); }} style={{ background: '#fff', color: '#88a', border: '1px solid #d1d9e6', padding: '6px 24px', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background='#fff'}>CLOSE ARCHIVE</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#4488ff', fontSize: 11, marginBottom: 16, borderBottom: '1px solid #d1d9e6', paddingBottom: 8, fontWeight: 'bold' }}>20210415_完了報告書.log</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#333' }}>
                      <div style={{ display: 'flex', gap: 16 }}><span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ OP_NAME ]</span><span>スズラン</span></div>
                      <div style={{ display: 'flex', gap: 16 }}><span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ STATUS ]</span><span>COMPLETE</span></div>
                      <div style={{ display: 'flex', gap: 16 }}><span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ DETAIL ]</span><span>対象確保。津田沼 302号室へ収容完了。</span></div>
                      <div style={{ display: 'flex', gap: 16 }}><span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ TIMESTAMP ]</span><span>2021-04-15 15:10</span></div>
                      <div style={{ display: 'flex', gap: 16 }}><span style={{ color: '#4488ff', minWidth: 90, fontWeight: 'bold' }}>[ OPERATOR ]</span><span>Sato</span></div>
                    </div>
                    <button onClick={() => setShowReport(false)} style={{ marginTop: 20, background: '#fff', color: '#4488ff', border: '1px solid #4488ff', padding: '8px 20px', fontSize: 12, cursor: 'pointer', letterSpacing: 1 }} onMouseEnter={e => e.currentTarget.style.background='#f0f7ff'} onMouseLeave={e => e.currentTarget.style.background='#fff'}>← BACK TO INDEX</button>
                  </>
                )}
              </div>
            )}
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, fontFamily: 'Arial, sans-serif' }}>
            <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 30, display: 'flex', gap: 2 }}>
              <span style={{ color: '#4285F4' }}>W</span>
              <span style={{ color: '#EA4335' }}>e</span>
              <span style={{ color: '#FBBC05' }}>b</span>
              <span style={{ color: '#34A853' }}> </span>
              <span style={{ color: '#EA4335' }}>S</span>
              <span style={{ color: '#4285F4' }}>e</span>
              <span style={{ color: '#FBBC05' }}>a</span>
              <span style={{ color: '#4285F4' }}>r</span>
              <span style={{ color: '#34A853' }}>c</span>
              <span style={{ color: '#EA4335' }}>h</span>
            </div>
            <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <form 
                style={{ width: '100%', height: 44, border: '1px solid #dfe1e5', borderRadius: 24, display: 'flex', alignItems: 'center', padding: '0 15px', boxShadow: '0 1px 6px rgba(32,33,36,0.28)', marginBottom: 30 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.target as HTMLFormElement).querySelector('input')?.value;
                  if (q) navigateToSearch(q);
                }}
              >
                <Globe size={18} color="#9aa0a6" style={{ marginRight: 10 }} />
                <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16 }} placeholder="検索ワードを入力してください" />
              </form>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={searchBtnStyle} onClick={() => {
                  const q = (document.querySelector('input[placeholder="検索ワードを入力してください"]') as HTMLInputElement)?.value;
                  if (q) navigateToSearch(q);
                }}>Web 検索</button>
                <button style={searchBtnStyle}>I'm Feeling Lucky</button>
              </div>
              <div style={{ marginTop: 40, textAlign: 'center', fontSize: 13, color: '#3c4043' }}>
                <div style={{ marginBottom: 15, fontWeight: 'bold' }}>習志野市のトレンド</div>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                  <span style={linkStyleActive} onClick={() => navigateToSearch('missing')}>津田沼駅 行方不明</span>
                  <span style={linkStyleActive} onClick={() => navigateToSearch('entertainment')}>人気アイドル解散</span>
                  <span style={linkStyleActive} onClick={() => navigateToSearch('アイドル')}>新作映画ランキング</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ width: '100%', background: '#f2f2f2', borderTop: '1px solid #e4e4e4', padding: '15px 30px', fontSize: 13, color: '#70757a', display: 'flex', gap: 25 }}>
              <span>日本</span>
              <span style={{ flex: 1 }} />
              <span>プライバシー</span>
              <span>規約</span>
              <span>設定</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const searchBtnStyle: React.CSSProperties = {
  background: '#f8f9fa', border: '1px solid #f8f9fa', borderRadius: 4, padding: '0 16px',
  height: 36, fontSize: 14, color: '#3c4043', cursor: 'pointer'
};

const linkStyleActive: React.CSSProperties = {
  color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer'
};

function JOISlotMachine() {
  const [stopCount, setStopCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState([true, true, true]);
  const [showReach, setShowReach] = useState(false);

  const handleStop = () => {
    if (stopCount < 3) {
      const nextCount = stopCount + 1;
      setIsSpinning(prev => {
        const next = [...prev];
        next[stopCount] = false;
        return next;
      });
      setStopCount(nextCount);

      // Trigger Reach effect
      if (nextCount === 2) {
        setShowReach(true);
        setTimeout(() => setShowReach(false), 800); // Hide after 0.8s
      }
    }
  };

  const resetSlot = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStopCount(0);
    setIsSpinning([true, true, true]);
    setShowReach(false);
  };

  // Auto replay logic
  useEffect(() => {
    if (stopCount === 3) {
      const timer = setTimeout(() => {
        resetSlot();
      }, 4000); // Wait for the 4s animation to finish
      return () => clearTimeout(timer);
    }
  }, [stopCount]);

  const symbols = ['7', 'BAR', '3', '0', '1', '4', '2', '9', '5', '8', '6'];

  return (
    <div 
      style={{ height: '100%', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', cursor: 'pointer', padding: '10px', boxSizing: 'border-box' }}
      onClick={stopCount < 3 ? handleStop : () => resetSlot()}
    >
      <div style={{ color: '#fff', fontSize: 'clamp(12px, 2.5vh, 20px)', marginBottom: '1vh', fontWeight: 'bold', textShadow: '0 0 10px #f00', textAlign: 'center', zIndex: 50 }}>
        {stopCount < 3 ? '画面をクリックしてリールを止めろ！' : '🌈 PRECEDENT REACH !!!! 🌈'}
      </div>

      <div style={{ display: 'flex', gap: '1.5vw', perspective: '1000px', zIndex: 10, height: '40vh', maxHeight: '400px', width: '100%', justifyContent: 'center' }}>
        {['J', 'O', 'I'].map((finalChar, i) => (
          <div key={i} style={{ 
            width: 'clamp(50px, 18vw, 130px)', height: '100%', position: 'relative', 
            background: 'linear-gradient(to bottom, #111 0%, #333 50%, #111 100%)', 
            border: '3px solid #ffd700', borderRadius: 10, 
            boxShadow: '0 0 15px rgba(255,215,0,0.3), inset 0 0 30px rgba(0,0,0,0.8)', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
              animation: isSpinning[i] ? 'joi-3d-spin 0.4s linear infinite' : 'none', 
              transform: !isSpinning[i] ? 'translateY(0)' : 'none' 
            }}>
              {[...Array(30)].map((_, idx) => {
                const isFirst = idx === 0;
                const displayChar = (!isSpinning[i] && isFirst) ? finalChar : symbols[idx % symbols.length];
                return (
                  <div key={idx} style={{ 
                    height: '40vh', maxHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 'clamp(40px, 15vh, 100px)', fontWeight: '900', color: '#fff', 
                    textShadow: '0 0 10px rgba(255,255,255,0.5)', 
                    animation: (!isSpinning[i] && isFirst) ? 'joi-rainbow 0.2s infinite' : 'none', 
                    flexShrink: 0 
                  }}>
                    {displayChar}
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5vh', color: '#ff0', fontSize: 'clamp(10px, 2vh, 16px)', fontWeight: 'bold', textShadow: '0 0 5px #000', zIndex: 50, textAlign: 'center' }}>
        {stopCount === 0 && "【第一段階】 集結せよ..."}
        {stopCount === 1 && "【中盤戦】 運命が動き出す..."}
        {stopCount === 2 && "【リーチ】 JOIリーチ発動！"}
        {stopCount === 3 && "超・大・当・り (オートリプレイ発動中)"}
      </div>

      {/* Reach Cut-in Overlay */}
      {showReach && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 55 }}>
           <div style={{
            width: '200%', height: '15vh', background: 'rgba(255,0,0,0.8)',
            transform: 'skewY(-5deg)', borderTop: '4px solid #fff', borderBottom: '4px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'joi-reach-in 0.3s ease-out forwards',
            boxShadow: '0 0 30px rgba(255,0,0,0.8)'
          }}>
            <div style={{ color: '#fff', fontSize: 'clamp(40px, 8vh, 100px)', fontWeight: '900', fontStyle: 'italic', textShadow: '4px 4px 0 #000' }}>
              JOI REACH!!
            </div>
          </div>
        </div>
      )}

      {stopCount === 3 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          {/* Flash Effect */}
          <div style={{
            position: 'absolute', inset: 0, background: '#fff', 
            animation: 'joi-flash 0.5s ease-out forwards', zIndex: 100 
          }} />

          <div style={{
            fontSize: 'clamp(80px, 25vh, 200px)',
            fontWeight: '900',
            fontFamily: 'Impact, sans-serif',
            animation: 'joi-rainbow 0.2s infinite, joi-big-flow 4s ease-out forwards',
            whiteSpace: 'nowrap',
            textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,215,0,0.5)',
            zIndex: 80,
            position: 'relative'
          }}>
            JOI
          </div>
          
          <div style={{ marginTop: '2vh', color: '#fff', fontSize: '12px', opacity: 0.6, zIndex: 80, position: 'relative' }}>AUTOMATIC REPLAYING...</div>
        </div>
      )}
    </div>
  );
}
