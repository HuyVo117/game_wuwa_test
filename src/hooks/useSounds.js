/**
 * @description Âm thanh cho game
 */
export const useSounds = () => {
  const audioCache = {};

  const playSound = (soundName) => {
    try {
      // Chỉ tạo audio một lần và cache lại
      if (!audioCache[soundName]) {
        switch (soundName) {
          case 'click':
            audioCache[soundName] = new Audio('/sounds/click.mp3');
            break;
          case 'select':
            audioCache[soundName] = new Audio('/sounds/select.mp3');
            break;
          case 'success':
            audioCache[soundName] = new Audio('/sounds/success.mp3');
            break;
          case 'fail':
            audioCache[soundName] = new Audio('/sounds/fail.mp3');
            break;
          default:
            console.warn('Unknown sound:', soundName);
            return;
        }
      }

      // Clone để có thể chơi nhiều sound cùng lúc
      const sound = audioCache[soundName].cloneNode();
      
      // Thêm cleanup khi audio chạy xong
      sound.addEventListener('ended', () => {
        sound.remove();
      });
      
      // Volume nhỏ hơn để không quá lớn
      sound.volume = 0.4;
      
      // Phát âm thanh
      sound.play().catch(error => {
        // Xử lý lỗi "play() failed because the user didn't interact with the document first"
        console.warn('Could not play sound:', error);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Preload tất cả âm thanh
  const preloadSounds = () => {
    ['click', 'select', 'success', 'fail'].forEach(sound => {
      // Tạo sẵn trong cache
      if (!audioCache[sound]) {
        switch (sound) {
          case 'click':
            audioCache[sound] = new Audio('/sounds/click.mp3');
            break;
          case 'select':
            audioCache[sound] = new Audio('/sounds/select.mp3');
            break;
          case 'success':
            audioCache[sound] = new Audio('/sounds/success.mp3');
            break;
          case 'fail':
            audioCache[sound] = new Audio('/sounds/fail.mp3');
            break;
        }
      }
    });
  };

  return {
    playSound,
    preloadSounds
  };
};
