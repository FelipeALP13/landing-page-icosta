from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "brand"
DIST = ROOT / "dist" / "assets"
OUTPUT = BRAND / "ICosta-Manual-da-Marca.pdf"

HEX = {
    "deep": "#061A15",
    "deep2": "#0B2F26",
    "green": "#0E3B30",
    "green_soft": "#195347",
    "gold": "#D5B66C",
    "gold2": "#B68D43",
    "paper": "#F2EEE5",
    "paper2": "#E6DFD2",
    "ink": "#10221C",
    "muted": "#68716C",
    "white": "#FFFDF7",
    "border": "#D9D9D9",
}
C = {name: colors.HexColor(value) for name, value in HEX.items()}


def register_fonts():
    candidates = {
        "ICSerif": Path(r"C:\Windows\Fonts\georgia.ttf"),
        "ICSerifItalic": Path(r"C:\Windows\Fonts\georgiai.ttf"),
        "ICSans": Path(r"C:\Windows\Fonts\arial.ttf"),
        "ICSansBold": Path(r"C:\Windows\Fonts\arialbd.ttf"),
    }
    for name, path in candidates.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))
    return {
        "serif": "ICSerif" if candidates["ICSerif"].exists() else "Times-Roman",
        "serif_italic": "ICSerifItalic" if candidates["ICSerifItalic"].exists() else "Times-Italic",
        "sans": "ICSans" if candidates["ICSans"].exists() else "Helvetica",
        "sans_bold": "ICSansBold" if candidates["ICSansBold"].exists() else "Helvetica-Bold",
    }


FONTS = register_fonts()
styles = getSampleStyleSheet()
ST = {
    "title": ParagraphStyle("ICTitle", fontName=FONTS["serif"], fontSize=31, leading=35, textColor=colors.black, spaceAfter=14),
    "h1": ParagraphStyle("ICH1", fontName=FONTS["serif"], fontSize=24, leading=28, textColor=colors.black, spaceAfter=10),
    "h2": ParagraphStyle("ICH2", fontName=FONTS["serif"], fontSize=14.5, leading=18, textColor=colors.black, spaceBefore=9, spaceAfter=5),
    "body": ParagraphStyle("ICBody", fontName=FONTS["sans"], fontSize=9.8, leading=13.6, textColor=C["ink"], spaceAfter=6),
    "lead": ParagraphStyle("ICLead", fontName=FONTS["serif"], fontSize=12.6, leading=17, textColor=C["ink"], spaceAfter=13),
    "small": ParagraphStyle("ICSmall", fontName=FONTS["sans"], fontSize=7.8, leading=10.2, textColor=C["muted"]),
    "label": ParagraphStyle("ICLabel", fontName=FONTS["sans_bold"], fontSize=7.5, leading=9, textColor=C["gold2"], tracking=1.2, spaceAfter=4),
    "white": ParagraphStyle("ICWhite", fontName=FONTS["sans"], fontSize=9.2, leading=13, textColor=C["white"]),
    "table_header": ParagraphStyle("ICTableHeader", fontName=FONTS["sans_bold"], fontSize=7.8, leading=10, textColor=C["white"]),
    "table_body": ParagraphStyle("ICTableBody", fontName=FONTS["sans"], fontSize=8.2, leading=10.5, textColor=C["ink"]),
    "bullet": ParagraphStyle("ICBullet", fontName=FONTS["sans"], fontSize=9.5, leading=13, textColor=C["ink"], leftIndent=12, firstLineIndent=-8, spaceAfter=4),
}


class BrandDocTemplate(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=0.72 * inch,
            rightMargin=0.72 * inch,
            topMargin=0.58 * inch,
            bottomMargin=0.62 * inch,
            title="Manual da marca ICosta Advocacia",
            author="ICosta Advocacia e Consultoria Jurídica",
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates(PageTemplate(id="brand", frames=[frame], onPage=draw_page))


def draw_page(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(C["border"])
        canvas.setLineWidth(0.45)
        canvas.line(doc.leftMargin, 0.48 * inch, letter[0] - doc.rightMargin, 0.48 * inch)
        canvas.setFont(FONTS["sans"], 7.2)
        canvas.setFillColor(C["muted"])
        canvas.drawString(doc.leftMargin, 0.29 * inch, "ICosta Advocacia e Consultoria Jurídica")
        canvas.drawCentredString(letter[0] / 2, 0.29 * inch, "Manual da marca  |  Versão 1.0")
        canvas.drawRightString(letter[0] - doc.rightMargin, 0.29 * inch, str(doc.page))
    canvas.restoreState()


def p(text, style="body"):
    return Paragraph(text, ST[style])


def heading(text, level=2):
    return Paragraph(text, ST["h1" if level == 1 else "h2"])


def bullet(text):
    return Paragraph(f"• {text}", ST["bullet"])


def checkbox(text):
    return Paragraph(f"□ {text}", ST["bullet"])


def section(story, number, title, intro):
    story.extend([p(number, "label"), heading(title, 1), p(intro, "lead")])


def standard_table(headers, rows, widths):
    data = [[p(h, "table_header") for h in headers]]
    data.extend([[p(str(value), "table_body") for value in row] for row in rows])
    table = Table(data, colWidths=[w * inch for w in widths], repeatRows=1, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), C["deep2"]),
        ("GRID", (0, 0), (-1, -1), 0.45, C["border"]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]
    for idx in range(1, len(data)):
        if idx % 2 == 0:
            commands.append(("BACKGROUND", (0, idx), (-1, idx), colors.HexColor("#F7F5EF")))
    table.setStyle(TableStyle(commands))
    return table


def two_columns(left_title, left_text, right_title, right_text):
    data = [[
        [heading(left_title, 2), p(left_text)],
        [heading(right_title, 2), p(right_text)],
    ]]
    table = Table(data, colWidths=[3.4 * inch, 3.4 * inch], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), C["paper"]),
        ("BACKGROUND", (1, 0), (1, 0), C["paper2"]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    return table


def proportional_image(path, width):
    with PILImage.open(path) as image:
        ratio = image.height / image.width
    return Image(str(path), width=width, height=width * ratio)


def logo_panel(image_path, width=4.7 * inch):
    logo = proportional_image(image_path, width)
    table = Table([[logo]], colWidths=[6.95 * inch], hAlign="CENTER")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), C["deep"]),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 21),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 21),
    ]))
    return table


def build():
    story = []

    # Cover
    story.extend([
        logo_panel(BRAND / "logo-primary.png"),
        Spacer(1, 0.38 * inch),
        p("IDENTIDADE INSTITUCIONAL", "label"),
        p("Manual da marca ICosta Advocacia", "title"),
        p("Diretrizes para uma comunicação reconhecível, sóbria e consistente", "lead"),
        Spacer(1, 0.25 * inch),
        p("Versão 1.0  |  Outubro de 2026", "small"),
        Spacer(1, 0.2 * inch),
        Paragraph("Uma nova fase. A mesma responsabilidade.", ParagraphStyle("Tagline", parent=ST["lead"], fontName=FONTS["serif_italic"], textColor=C["gold2"])),
        PageBreak(),
    ])

    section(story, "01", "Como usar este manual", "Este documento organiza a identidade da ICosta Advocacia e define como a marca deve aparecer e falar em todos os pontos de contato.")
    story.extend([
        heading("Objetivo"),
        p("O manual serve de referência para o escritório, fornecedores, designers, desenvolvedores e profissionais responsáveis por conteúdo. As regras protegem o reconhecimento da marca e ajudam a manter a comunicação compatível com a atividade jurídica."),
        heading("Ordem de decisão"),
        bullet("Preservar a legibilidade e a identificação profissional."),
        bullet("Usar os arquivos oficiais do logotipo sem redesenhar ou alterar seus elementos."),
        bullet("Aplicar a paleta, a tipografia e o tom de voz descritos neste manual."),
        bullet("Revisar cada peça conforme as regras de publicidade da advocacia antes da publicação."),
        heading("Resumo da identidade"),
        two_columns("Expressão visual", "Verde profundo, dourado discreto, fundo claro e composição com bastante espaço. A estética combina tradição editorial e clareza contemporânea.", "Expressão verbal", "Linguagem direta, respeitosa e informativa. O conteúdo explica contextos e possibilidades sem prometer resultados ou criar pressão comercial."),
        PageBreak(),
    ])

    section(story, "02", "Fundamentos da marca", "A identidade parte de uma advocacia próxima, técnica e responsável, conduzida por Isilda e Simone da Costa e Silva.")
    story.extend([
        heading("Propósito"),
        p("Ajudar pessoas, famílias, empresas e condomínios a compreender questões jurídicas e tomar decisões com mais clareza."),
        heading("Posicionamento"),
        p("A ICosta Advocacia se apresenta como um escritório que começa pelo contexto. O atendimento prioriza escuta, análise cuidadosa e comunicação compreensível antes da definição de qualquer caminho jurídico."),
        heading("Traços de personalidade"),
        standard_table(["Traço", "Como aparece"], [
            ("Clara", "Explica termos, etapas, riscos e limites em linguagem acessível."),
            ("Sóbria", "Evita excesso visual, exagero verbal e tom promocional."),
            ("Próxima", "Fala com atenção e respeito, sem informalidade excessiva."),
            ("Analítica", "Organiza fatos e alternativas antes de orientar uma decisão."),
            ("Responsável", "Não promete resultados e protege informações sensíveis."),
        ], [1.55, 5.25]),
        heading("Princípios de experiência"),
        bullet("Contexto antes de resposta pronta."),
        bullet("Clareza antes de linguagem técnica desnecessária."),
        bullet("Orientação responsável antes de persuasão comercial."),
        PageBreak(),
    ])

    section(story, "03", "Sistema de mensagens", "Nome, descritor e frases institucionais têm funções diferentes. A separação evita que campanhas temporárias sejam confundidas com o nome da marca.")
    story.extend([
        standard_table(["Elemento", "Forma recomendada", "Função"], [
            ("Nome", "ICosta Advocacia", "Forma curta para títulos e identificação corrente."),
            ("Descritor", "Advocacia e Consultoria Jurídica", "Explica a atividade e acompanha o logotipo principal."),
            ("Assinatura institucional", "Uma nova fase. A mesma responsabilidade.", "Mensagem institucional atualmente usada em peças de apresentação."),
            ("Mensagem editorial", "Direito não é sobre fórmulas. É sobre contexto.", "Abre conteúdos sobre método, posicionamento e atendimento."),
            ("Ideia central", "Direito com contexto e clareza", "Orienta redação e criação; não precisa aparecer em toda peça."),
        ], [1.4, 2.55, 2.85]),
        heading("Regra de uso"),
        p("O nome e o descritor identificam o escritório. As demais frases são recursos editoriais e podem ser atualizadas. Não devem ser incorporadas de forma permanente ao desenho do logotipo sem uma revisão formal da identidade."),
        heading("Identificação profissional"),
        p("Em peças institucionais, rodapés e páginas de contato, usar os nomes e inscrições: Isilda Maria da Costa e Silva - OAB/SP 56.944; Simone da Costa e Silva - OAB/SP 259.760."),
        PageBreak(),
    ])

    section(story, "04", "Assinatura visual", "O logotipo principal reúne o monograma, o nome ICosta e o descritor Advocacia e Consultoria Jurídica.")
    story.extend([
        logo_panel(BRAND / "logo-primary.png", 4.8 * inch),
        heading("Versão principal"),
        p("Usar preferencialmente sobre verde profundo. Essa combinação preserva contraste, reconhecimento e o caráter institucional da marca."),
        heading("Versão reduzida"),
    ])
    mono = proportional_image(BRAND / "monogram.png", 1.6 * inch)
    reduced = Table([[mono, p("Use o monograma em favicon, avatar, marca d'água e espaços em que o logotipo completo perderia legibilidade. O monograma não substitui a identificação completa em peças institucionais ou jurídicas.")]], colWidths=[2.15 * inch, 4.65 * inch])
    reduced.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), C["deep"]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (0, 0), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    story.extend([
        reduced,
        heading("Arquivos oficiais"),
        p("Para meios digitais, priorizar os arquivos SVG. Para documentos e apresentações que não aceitem vetores, usar PNG em alta resolução com fundo transparente."),
        PageBreak(),
    ])

    section(story, "05", "Área de proteção e tamanhos", "O espaço ao redor da marca evita competição com textos, imagens e bordas.")
    protected_logo = proportional_image(BRAND / "logo-primary.png", 4.3 * inch)
    protection = Table([[protected_logo], [p("MARGEM LIVRE MÍNIMA: 1/2 DA ALTURA DO MONOGRAMA", "label")]], colWidths=[6.8 * inch])
    protection.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), C["deep"]),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, 0), 28),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 14),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 18),
    ]))
    story.extend([
        protection,
        heading("Tamanhos mínimos"),
        standard_table(["Aplicação", "Logotipo completo", "Monograma"], [("Impressão", "35 mm de largura", "12 mm de largura"), ("Tela", "180 px de largura", "40 px de largura")], [2.2, 2.3, 2.3]),
        heading("Usos incorretos"),
        bullet("Não distorcer, inclinar, recortar ou reorganizar os elementos."),
        bullet("Não mudar as cores fora das versões aprovadas."),
        bullet("Não aplicar sombra, brilho, contorno ou efeitos tridimensionais."),
        bullet("Não usar sobre fotografia sem uma área de contraste suficiente."),
        bullet("Não substituir a tipografia do nome ou redesenhar o símbolo."),
        PageBreak(),
    ])

    section(story, "06", "Paleta de cores", "A paleta combina confiança, discrição e calor. O verde estrutura a identidade; o dourado orienta o olhar; os neutros preservam leitura e espaço.")
    palette = [
        ("Verde profundo", "deep", "#061A15  RGB 6 26 21", "Fundos principais, cabeçalhos e rodapés"),
        ("Verde institucional", "green", "#0E3B30  RGB 14 59 48", "Blocos, ícones e superfícies secundárias"),
        ("Verde suave", "green_soft", "#195347  RGB 25 83 71", "Variações discretas e estados de interface"),
        ("Dourado principal", "gold", "#D5B66C  RGB 213 182 108", "Destaques, chamadas e detalhes"),
        ("Dourado escuro", "gold2", "#B68D43  RGB 182 141 67", "Texto de apoio e detalhes em fundo claro"),
        ("Papel", "paper", "#F2EEE5  RGB 242 238 229", "Fundo claro principal"),
        ("Tinta", "ink", "#10221C  RGB 16 34 28", "Texto principal sobre fundo claro"),
        ("Branco quente", "white", "#FFFDF7  RGB 255 253 247", "Texto e áreas claras sobre verde"),
    ]
    data = [[p("Cor", "table_header"), p("Amostra", "table_header"), p("Código", "table_header"), p("Uso principal", "table_header")]]
    for name, color_name, code, usage in palette:
        data.append([p(name, "table_body"), "", p(code, "table_body"), p(usage, "table_body")])
    palette_table = Table(data, colWidths=[1.55 * inch, 0.75 * inch, 1.75 * inch, 2.8 * inch], repeatRows=1)
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), C["deep2"]),
        ("GRID", (0, 0), (-1, -1), 0.45, C["border"]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for row_idx, (_, color_name, _, _) in enumerate(palette, start=1):
        commands.append(("BACKGROUND", (1, row_idx), (1, row_idx), C[color_name]))
        if row_idx % 2 == 0:
            commands.append(("BACKGROUND", (0, row_idx), (0, row_idx), colors.HexColor("#F7F5EF")))
            commands.append(("BACKGROUND", (2, row_idx), (3, row_idx), colors.HexColor("#F7F5EF")))
    palette_table.setStyle(TableStyle(commands))
    story.extend([
        palette_table,
        heading("Proporção recomendada"),
        p("Em uma composição institucional, usar aproximadamente 60 por cento de tons claros, 30 por cento de verdes e até 10 por cento de dourado. O dourado deve orientar a atenção, não dominar a página."),
        PageBreak(),
    ])

    section(story, "07", "Sistema tipográfico", "A tipografia combina uma serifada editorial para títulos com uma sans serif direta para textos e interfaces.")
    story.extend([
        heading("Newsreader"),
        Paragraph("Direito com contexto e clareza", ParagraphStyle("SerifSample", parent=ST["h1"], fontSize=23, leading=27, textColor=C["ink"])),
        p("Uso: títulos, frases editoriais, citações, números de seção e destaques. Pesos recomendados: 300 a 500. Substituta segura quando a fonte não estiver disponível: Georgia."),
        heading("DM Sans"),
        Paragraph("ADVOCACIA E CONSULTORIA JURÍDICA", ParagraphStyle("SansSample", parent=ST["body"], fontName=FONTS["sans_bold"], fontSize=12.5, leading=16)),
        p("Uso: textos corridos, legendas, navegação, botões, formulários e informações técnicas. Pesos recomendados: 400, 500 e 600. Substituta segura: Arial."),
        heading("Hierarquia recomendada"),
        standard_table(["Nível", "Fonte", "Orientação"], [
            ("Título principal", "Newsreader 300", "Grande, respirado e com poucas linhas"),
            ("Título de seção", "Newsreader 300 ou 400", "Claro e objetivo"),
            ("Subtítulo", "DM Sans 600", "Curto, sem excesso de caixa alta"),
            ("Texto", "DM Sans 400", "Leitura confortável e contraste alto"),
            ("Legenda", "DM Sans 500", "Pequena, mas sempre legível"),
        ], [1.55, 1.7, 3.55]),
        heading("Regras"),
        bullet("Evitar textos longos totalmente em caixa alta."),
        bullet("Não usar mais de duas famílias tipográficas na mesma peça."),
        bullet("Manter alinhamento à esquerda como padrão para conteúdo informativo."),
        PageBreak(),
    ])

    section(story, "08", "Direção de imagens", "As imagens devem transmitir presença, ambiente profissional e atenção aos detalhes sem recorrer a símbolos jurídicos genéricos em excesso.")
    hero = proportional_image(DIST / "hero-architecture-v2.jpg", 4.15 * inch)
    portrait = proportional_image(BRAND / "isilda-maria-da-costa-e-silva.png", 2.5 * inch)
    image_table = Table([[hero, portrait]], colWidths=[4.25 * inch, 2.55 * inch], hAlign="LEFT")
    image_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 4)]))
    story.extend([
        image_table,
        heading("Fotografia institucional"),
        bullet("Priorizar luz natural, arquitetura, materiais e ambientes reais do escritório."),
        bullet("Retratar as profissionais com postura natural, vestuário sóbrio e enquadramento limpo."),
        bullet("Usar tons neutros ou verdes discretos e contraste moderado."),
        bullet("Obter autorização antes de publicar imagens de pessoas, documentos ou ambientes identificáveis."),
        heading("Evitar"),
        bullet("Martelos, balanças, tribunais e apertos de mão usados como imagens genéricas."),
        bullet("Cenas excessivamente encenadas, filtros intensos ou tratamento que altere a aparência real."),
        bullet("Documentos legíveis, telas abertas e qualquer dado de cliente."),
        PageBreak(),
    ])

    section(story, "09", "Composição e elementos gráficos", "A composição usa contraste, ritmo editorial e espaços amplos para conduzir a leitura.")
    story.extend([
        heading("Estrutura"),
        bullet("Usar margens generosas e limitar a largura de blocos de texto."),
        bullet("Organizar informações em faixas claras, com um assunto principal por bloco."),
        bullet("Usar linhas finas e círculos apenas como apoio, nunca como ornamentação dominante."),
        bullet("Reservar o dourado para elementos que precisam de atenção imediata."),
        heading("Padrões gráficos"),
        standard_table(["Elemento", "Aplicação"], [
            ("Círculo", "Proteção do monograma, numeração e pontos de navegação."),
            ("Linha fina", "Separação de conteúdos, progressão e organização editorial."),
            ("Numeração", "Sequência de seções, etapas e conteúdos educativos."),
            ("Fundo escuro", "Aberturas, chamadas principais e encerramentos."),
            ("Fundo papel", "Textos longos, documentos e áreas de leitura."),
        ], [1.55, 5.25]),
        heading("Ícones"),
        p("Preferir ícones lineares, simples e com cantos discretos. Usar a mesma espessura de traço dentro de uma peça. Evitar ilustrações caricatas, gradientes chamativos e conjuntos de estilos diferentes."),
        heading("Acessibilidade"),
        p("Manter contraste suficiente entre texto e fundo, tamanho confortável de leitura, foco visível em interfaces e texto alternativo para imagens informativas."),
        PageBreak(),
    ])

    section(story, "10", "Voz e linguagem", "A ICosta fala de forma compreensível e segura. O texto deve ajudar o leitor a entender o assunto antes de convidá-lo ao contato.")
    story.extend([
        standard_table(["Preferir", "Evitar"], [
            ("Explicar o que pode ser analisado", "Indicar que existe uma solução garantida"),
            ("Apresentar possibilidades e limites", "Criar urgência comercial ou medo"),
            ("Usar frases diretas e termos explicados", "Acumular jargão jurídico"),
            ("Convidar para uma conversa", "Pressionar para contratação imediata"),
            ("Dizer que cada caso depende de fatos e documentos", "Generalizar conclusões para qualquer situação"),
        ], [3.4, 3.4]),
        heading("Exemplos de redação"),
        two_columns("Recomendado", "Uma análise individual permite compreender os fatos, os documentos e os caminhos possíveis.", "Não recomendado", "Resolva seu problema agora com a melhor estratégia e resultado garantido."),
        Spacer(1, 8),
        two_columns("Recomendado", "O primeiro contato ajuda a identificar se a demanda está dentro da atuação do escritório.", "Não recomendado", "Não perca tempo. Fale hoje com especialistas e proteja seus direitos."),
        heading("Chamadas para ação"),
        p("Usar chamadas neutras, como Falar com o escritório, Conhecer a atuação, Entender como trabalhamos e Agendar uma conversa. Evitar frases que explorem ansiedade, prazo artificial ou promessa de vantagem."),
        PageBreak(),
    ])

    section(story, "11", "Publicidade jurídica responsável", "Toda comunicação deve preservar o caráter informativo e a sobriedade esperada da advocacia.")
    story.extend([
        heading("Pode"),
        bullet("Apresentar áreas de atuação, profissionais, inscrições na OAB e canais de contato."),
        bullet("Publicar conteúdo educativo, objetivo e verdadeiro."),
        bullet("Usar logotipo, fotografias profissionais, site, redes sociais e links de contato."),
        bullet("Explicar procedimentos e temas jurídicos sem transformar o conteúdo em consulta individual."),
        heading("Não pode"),
        bullet("Prometer resultado, êxito ou solução certa."),
        bullet("Divulgar preço, desconto, gratuidade promocional ou condição comercial como chamariz."),
        bullet("Comparar o escritório com concorrentes, usar ranking próprio ou afirmar superioridade."),
        bullet("Expor clientes, processos, decisões ou resultados para autopromoção."),
        bullet("Criar pressão de contratação, sensacionalismo ou captação indevida de clientela."),
        heading("Avisos recomendados"),
        p("Em conteúdos educativos, informar que o material não substitui análise individual. Em páginas de contato, orientar o público a não enviar dados sensíveis antes da confirmação do atendimento."),
        heading("Referências"),
        p("Código de Ética e Disciplina da OAB e Provimento OAB nº 205/2021. A equipe deve revisar novas normas e orientações da OAB antes de alterar campanhas ou formatos de publicidade."),
        PageBreak(),
    ])

    section(story, "12", "Aplicações e controle de qualidade", "Cada material deve preservar a identidade visual, identificar corretamente o escritório e respeitar os limites da comunicação jurídica.")
    story.extend([
        heading("Aplicações prioritárias"),
        standard_table(["Canal", "Padrão"], [
            ("Site", "Logotipo completo no cabeçalho, uma ação principal de contato, leitura acessível e avisos legais."),
            ("Instagram", "Capas limpas, título curto, identificação discreta e legenda de caráter informativo."),
            ("WhatsApp", "Avatar com monograma e mensagens objetivas, sem aconselhamento automático ou promessa."),
            ("Documentos", "Logotipo completo, nomes profissionais, OAB, contato e margens adequadas."),
            ("Apresentações", "Uma ideia por tela, títulos editoriais e dados jurídicos com fonte identificada."),
            ("Materiais impressos", "Cores controladas, prova antes da tiragem e tamanho mínimo do logotipo."),
        ], [1.45, 5.35]),
        heading("Checklist antes de publicar"),
    ])
    for item in (
        "O arquivo oficial do logotipo foi usado sem alteração.",
        "Nome, descritor, profissionais e inscrições estão corretos.",
        "Cores e tipografia seguem a hierarquia do manual.",
        "O conteúdo é informativo e não promete resultado.",
        "Não há preço promocional, comparação, pressão ou exposição de cliente.",
        "Textos, links, telefone, endereço e horário foram revisados.",
        "Imagens têm autorização e não mostram dados sensíveis.",
        "A peça mantém contraste e leitura em celular e impressão.",
    ):
        story.append(checkbox(item))
    story.extend([
        heading("Gestão dos arquivos"),
        p("Manter os arquivos oficiais em uma pasta única, com controle de versão. Alterações no símbolo, no nome, na paleta ou na assinatura principal devem gerar uma nova versão deste manual."),
        Spacer(1, 8),
        Paragraph("ICosta Advocacia e Consultoria Jurídica  |  Versão 1.0", ParagraphStyle("Close", parent=ST["lead"], textColor=C["gold2"])),
    ])

    BrandDocTemplate(str(OUTPUT)).build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
