import { Show } from 'solid-js';

function StationDetails(props) {
  const { loading, currentPlayingStation } = props;

  return (
    <div class="md:w-2/3 mt-4 md:mt-0 flex flex-col items-center justify-center h-full">
      <Show when={loading()}>
        <p class="text-center">جاري التحميل...</p>
      </Show>
      <Show when={!loading() && currentPlayingStation()}>
        <div class="w-full text-center">
          <h2 class="text-2xl font-bold mb-4">{currentPlayingStation().name}</h2>
          <div class="flex flex-col items-center space-y-4">
            <Show when={currentPlayingStation().favicon}>
              <img
                src={currentPlayingStation().favicon}
                alt="شعار المحطة"
                class="w-32 h-32 object-contain"
              />
            </Show>
            <p class="text-lg">الدولة: {currentPlayingStation().country}</p>
            <p class="text-lg">اللغة: {currentPlayingStation().language}</p>
            <Show when={currentPlayingStation().bitrate}>
              <p class="text-lg">
                معدل البت: {currentPlayingStation().bitrate} kbps
              </p>
            </Show>
            <Show when={currentPlayingStation().tags}>
              <p class="text-lg">التصنيفات: {currentPlayingStation().tags}</p>
            </Show>
            <Show when={currentPlayingStation().clickcount}>
              <p class="text-lg">
                عدد مرات التشغيل: {currentPlayingStation().clickcount}
              </p>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={!loading() && !currentPlayingStation()}>
        <p class="text-center">اختر محطة من القائمة لتشغيلها</p>
      </Show>
    </div>
  );
}

export default StationDetails;