import { For, Show } from 'solid-js';

function StationList(props) {
  const {
    filteredStations,
    loading,
    selectedStation,
    setSelectedStation,
    setSelectedStationIndex,
    playStation,
    stopStation,
    currentPlayingStation,
    selectedStationIndex,
    previousStation,
    nextStation,
    volume,
    setVolume,
  } = props;

  return (
    <>
      <Show
        when={!loading()}
        fallback={<p class="text-center">جاري التحميل...</p>}
      >
        <Show
          when={filteredStations().length > 0}
          fallback={<p class="text-center">لا توجد محطات متاحة في الوقت الحالي.</p>}
        >
          <select
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border cursor-pointer"
            size="10"
            onChange={(e) => {
              const selectedStationuuid = e.target.value;
              const index = filteredStations().findIndex(
                (s) => s.stationuuid === selectedStationuuid
              );
              if (index !== -1) {
                setSelectedStation(filteredStations()[index]);
                setSelectedStationIndex(index);
              }
            }}
            disabled={loading()}
          >
            <option value="" selected disabled>
              اختر محطة
            </option>
            <For each={filteredStations()}>
              {(station) => (
                <option value={station.stationuuid}>{station.name}</option>
              )}
            </For>
          </select>
        </Show>
      </Show>
      <Show when={selectedStation()}>
        <div class="flex flex-col space-y-2">
          <div class="flex space-x-reverse space-x-2">
            <Show
              when={
                !currentPlayingStation() ||
                currentPlayingStation().stationuuid !== selectedStation().stationuuid
              }
            >
              <button
                class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => playStation(selectedStation())}
              >
                تشغيل
              </button>
            </Show>
            <Show
              when={
                currentPlayingStation() &&
                currentPlayingStation().stationuuid === selectedStation().stationuuid
              }
            >
              <button
                class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => stopStation()}
              >
                إيقاف
              </button>
            </Show>
          </div>
          <div class="flex space-x-reverse space-x-2">
            <button
              class={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                selectedStationIndex() === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={previousStation}
              disabled={selectedStationIndex() === 0}
            >
              المحطة السابقة
            </button>
            <button
              class={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                selectedStationIndex() === filteredStations().length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={nextStation}
              disabled={selectedStationIndex() === filteredStations().length - 1}
            >
              المحطة التالية
            </button>
          </div>
          <div class="w-full mt-4">
            <label for="volume" class="text-lg font-semibold mb-2 block">
              مستوى الصوت
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume()}
              onInput={(e) => setVolume(e.target.value)}
              class="w-full cursor-pointer"
            />
          </div>
        </div>
      </Show>
    </>
  );
}

export default StationList;