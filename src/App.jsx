import { createSignal, onMount, For, Show } from 'solid-js';

function App() {
  const [stations, setStations] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [currentStation, setCurrentStation] = createSignal(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/stations/bylanguage/arabic');
      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        console.error('Error fetching stations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchStations();
  });

  const filteredStations = () => {
    const query = searchQuery().toLowerCase();
    return stations().filter((station) =>
      station.name.toLowerCase().includes(query)
    );
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex flex-col">
      <h1 class="text-4xl font-bold text-blue-800 mb-4 text-center">راديو عربي احترافي</h1>
      <div class="flex flex-col md:flex-row md:space-x-4">
        <div class="md:w-1/3">
          <input
            type="text"
            placeholder="بحث"
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.target.value)}
            class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border"
          />
          <Show
            when={!loading()}
            fallback={
              <p class="text-center text-blue-800">جاري التحميل...</p>
            }
          >
            <div class="max-h-[60vh] overflow-y-auto">
              <For each={filteredStations()}>
                {(station) => (
                  <div
                    class="p-4 mb-2 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer"
                    onClick={() => setCurrentStation(station)}
                  >
                    <p class="text-blue-800 font-semibold">{station.name}</p>
                    <p class="text-gray-600 text-sm">{station.country}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
        <div class="md:w-2/3 mt-4 md:mt-0 flex flex-col items-center">
          <Show when={currentStation()}>
            <div class="w-full">
              <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">{currentStation().name}</h2>
              <audio
                src={currentStation().url_resolved}
                controls
                autoplay
                class="w-full"
              />
            </div>
          </Show>
          <Show when={!currentStation()}>
            <p class="text-center text-blue-800">اختر محطة من القائمة لتشغيلها</p>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;