export interface Row{
    /**
     * Indice della riga
     */
    index: number

    /**
     * Callback per il binding tra il template della riga ed i dati
     * @param data 
     * @returns 
     */
    generateRow?: (data: any) => any

    /**
     * 
     */
    onEvent?: (observable: any) => any
}