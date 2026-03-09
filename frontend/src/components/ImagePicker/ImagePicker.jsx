/**
 * ImagePicker — componente de seleção/preview de imagem para formulários de admin.
 *
 * Props:
 *  - currentUrl  : string | null  — URL completa da imagem já salva (para mostrar no edit)
 *  - file        : File | null     — arquivo atualmente selecionado (state do pai)
 *  - onChange    : (File|null) => void — callback ao selecionar ou remover arquivo
 *  - onRemoveCurrent : () => void | null — se fornecido, mostra botão "Remover imagem atual"
 *  - label       : string          — rótulo exibido acima (padrão: "Imagem")
 *  - multiple    : bool            — habilita seleção múltipla (onChange recebe File[])
 */
import { useRef } from 'react'
import styles from './ImagePicker.module.css'

export default function ImagePicker({
  currentUrl = null,
  file = null,
  files = null,        // para modo múltiplo
  onChange,
  onRemoveCurrent = null,
  label = 'Imagem',
  multiple = false,
}) {
  const inputRef = useRef(null)

  // URL de preview do(s) arquivo(s) selecionado(s)
  const previewUrl = file ? URL.createObjectURL(file) : null
  const previewUrls = files?.length > 0
    ? Array.from(files).map((f) => URL.createObjectURL(f))
    : []

  const handleFileChange = (e) => {
    if (multiple) {
      onChange(Array.from(e.target.files))
    } else {
      onChange(e.target.files[0] || null)
    }
    // Limpa o input para permitir re-selecionar o mesmo arquivo
    e.target.value = ''
  }

  const handleRemoveNew = (index) => {
    if (multiple) {
      const updated = Array.from(files).filter((_, i) => i !== index)
      onChange(updated)
    } else {
      onChange(null)
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      {/* Imagem atual (salva no servidor) */}
      {currentUrl && !previewUrl && (
        <div className={styles.currentSection}>
          <span className={styles.sectionTag}>Atual</span>
          <div className={styles.imageWrap}>
            <img src={currentUrl} alt="Imagem atual" className={styles.image} />
            {onRemoveCurrent && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={onRemoveCurrent}
                title="Remover imagem atual"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview de arquivo(s) selecionado(s) — modo único */}
      {!multiple && previewUrl && (
        <div className={styles.currentSection}>
          <span className={styles.sectionTag}>Nova</span>
          <div className={styles.imageWrap}>
            <img src={previewUrl} alt="Preview" className={styles.image} />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemoveNew()}
              title="Cancelar seleção"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Preview de arquivos selecionados — modo múltiplo */}
      {multiple && previewUrls.length > 0 && (
        <div className={styles.currentSection}>
          <span className={styles.sectionTag}>Novas ({previewUrls.length})</span>
          <div className={styles.multiGrid}>
            {previewUrls.map((url, i) => (
              <div key={i} className={styles.imageWrap}>
                <img src={url} alt={`Preview ${i + 1}`} className={styles.image} />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveNew(i)}
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de seleção */}
      <button
        type="button"
        className={styles.selectBtn}
        onClick={() => inputRef.current?.click()}
      >
        {multiple
          ? '+ Adicionar imagens'
          : (currentUrl || previewUrl)
            ? '↺ Trocar imagem'
            : '+ Selecionar imagem'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  )
}
