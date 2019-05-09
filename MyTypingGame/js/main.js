'use strict';

{
  const words = [
    'the',
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    'lazy',
    'dog',
  ];
  let word;
  let loc;
  let score;
  let miss;
  const timeLimit = 30 * 1000;
  let startTime;

  // ゲームが始まっているかどうかを変数で管理する
  let isPlaying = false;

  const target = document.getElementById('target');
  const scoreLabel = document.getElementById('score');
  const missLabel = document.getElementById('miss');
  const timerLabel = document.getElementById('timer');

  // 正解した文字を_にして、_と残りの文字で表現する関数
  function updateTarget() {
    let placeholder = '';
    for (let i = 0; i < loc; i++) {
      placeholder += '_';
    }
    target.textContent = placeholder + word.substring(loc);
  }

  // ゲーム終了時にアラートで結果を表示してくれる関数
  function showResult() {

    // 正答率を計算する時の分母
    let all = score + miss;

    // accuracy = 正答率
    // scoreもmissも0の場合、0で割ることになってしまい、計算できない
    // 条件分岐してscoreとmissが0の場合を作る
    let accuracy;
    if (all === 0) {
      accuracy = 0;
    } else {
      accuracy = score / all * 100;
    }
    alert(`${score} letters, ${miss} misses, ${accuracy.toFixed(2)}% accuracy!`);
  }

  function updateTimer() {
    // timeLeft = ゲームの残り時間
    const timeLeft = startTime + timeLimit - Date.now();
    // /1000でミリ秒を秒に、toFixedで小数点第２位まで表示
    timerLabel.textContent = (timeLeft / 1000).toFixed(2);

    // 10ミリ秒後にupdateTimerを実行する関数
    const timeoutId = setTimeout(() => {
      updateTimer();
    }, 10);

    if (timeLeft < 0) {
      isPlaying = false;

      // updateTimerのsetTimeoutをキャンセルする≒タイマーを止める
      clearTimeout(timeoutId);

      // 100ミリ秒後にshowResultを呼び出す
      setTimeout(() => {
        showResult();
      }, 100);

      timerLabel.textContent = '0.00';

      // リプレイしますか？という確認のメッセージ
      target.textContent = 'click to replay';
    }
  }

  // 最初の画面でクリックしたら画面が切り替わり、ゲームが始まる関数
  window.addEventListener('click', () => {
    // ゲームが始まってからのクリックをカウントしないための記述
    // カウントできてしまうとゲーム中でのクリックが読み込まれて、
    // ゲーム終了後にアラートが余計に出てきてしまう
    if (isPlaying === true) {
      return;
    }

    isPlaying = true;

    loc = 0;
    score = 0;
    miss = 0;
    scoreLabel.textContent = score;
    missLabel.textContent = miss;
    word = words[Math.floor(Math.random() * words.length)];

    updateTarget();
    startTime = Date.now();
    updateTimer();
  });

  window.addEventListener('keyup', e => {
    // ゲームが始まってからカウントされるようにする記述
    if (isPlaying !== true) {
      return;
    }

    if (e.key === word[loc]) {
      loc++;
      // 最後の文字を入力し終えたら、次の単語が出る条件分岐
      if (loc === word.length) {
        word = words[Math.floor(Math.random() * words.length)];
        loc = 0;
      }
      score++;
      scoreLabel.textContent = score;
      updateTarget();
    } else {
      miss++;
      missLabel.textContent = miss;
    }
  });
}
