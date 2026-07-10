/**
 * Menjalankan sebuah promise, tapi memastikan durasi total minimal `minMs`.
 * Berguna supaya loading/animasi (mis. popup verifikasi NIK) gak "kedip"
 * kalau request ke DB-nya kelar dalam hitungan milidetik.
 *
 * Menerima PromiseLike (bukan cuma Promise) supaya kompatibel dengan
 * Supabase query builder (mis. `supabase.from(...).select(...).single()`),
 * yang thenable tapi bukan instance Promise asli — kalau signature-nya
 * strict `Promise<T>`, TypeScript gagal infer generic-nya dan jatuh ke `{}`.
 *
 * Contoh:
 *   setSearching(true)
 *   const { data, error } = await withMinDelay(
 *     supabase.from('karyawan').select('*').eq('nik', nik).single(),
 *     1200
 *   )
 *   setSearching(false)
 */
export async function withMinDelay<T>(promise: PromiseLike<T>, minMs: number = 1200): Promise<T> {
    const [result] = await Promise.all([
      Promise.resolve(promise),
      new Promise(resolve => setTimeout(resolve, minMs)),
    ])
    return result
  }