async function consultaFipe() {
    var codigoFipe = document.getElementById('fipe').value;

    console.log("Função consultaFipe chamada com código:", codigoFipe);
    //se tiver menos de 8 digitos, retornar erro
    if (codigoFipe.length !== 8) {
        alert('Código FIPE inválido!');
        return;
    }
    //url da api
    var url = `https://brasilapi.com.br/api/fipe/preco/v1/${codigoFipe}`;
    //se não houver codigo valido no catalogo da api retornar erro
    try {
        var response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            throw new Error("Código FIPE não encontrado!");
        }   
        var data = await response.json();
        console.log(data);
        //pegar valor do json e converter em numero
        if (data.length > 0 && data[0].valor) {
            var valorString = data[0].valor; 
            var valorNumero = parseFloat(valorString.replace("R$", "")
                                                    .replace(/\./g, "")
                                                    .replace(",", ".").trim());
            console.log("Valor convertido:", valorNumero);
            // calcular plano A e plano B
            var pA, pB;

            if (valorNumero > 100000.00) { 
                pA = valorNumero / 50000 * 50 + 95;
                pB = valorNumero / 50000 * 50 + 65;
            } else if (valorNumero > 75000.00) { 
                pA = valorNumero / 40000 * 70 + 75;
                pB = valorNumero / 50000 * 70 + 45;
            } else if (valorNumero > 10000.00) { 
                pA = valorNumero / 30000 * 100 + 95;
                pB = valorNumero / 50000 * 100 + 65;
            }

            // Transformar em formato R$:XX,XX
            var pAFormatado = pA.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            var pBFormatado = pB.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Criar tabela
            var tabelaHtml = `
                <table class="table table-bordered position-absolute">
                    <tr>
                        <td>Planos:</td>
                        <td>Mensalidade:</td>
                    </tr>
                    <tr>
                        <td>A</td>
                        <td>${pAFormatado}</td>
                    </tr>
                    <tr>
                        <td>B</td>
                        <td>${pBFormatado}</td>
                    </tr>
                </table>
            `;

            // Adiciona a tabela ao header do HTML
            document.getElementById('resultado').innerHTML = tabelaHtml;
        } else {
            console.warn("Dados não disponíveis ou valor não encontrado:", data);
            alert("Endereço não disponível.");
        }

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}
