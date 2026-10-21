from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Mm, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "brand"
OUTPUT = Path(__file__).resolve().parent / "folha-timbrada-icosta.docx"

GREEN = "061A15"
INK = "10221C"
GOLD = "D5B66C"
WARM_WHITE = "FFFDF7"


def set_cell_shading(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def set_cell_margins(cell, top=100, start=140, bottom=100, end=140):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, *, bottom=None, top=None):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)

    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        current = borders.find(qn(f"w:{edge}"))
        if current is not None:
            borders.remove(current)
        element = OxmlElement(f"w:{edge}")
        style = top if edge == "top" else bottom if edge == "bottom" else None
        if style:
            element.set(qn("w:val"), "single")
            element.set(qn("w:sz"), str(style[0]))
            element.set(qn("w:space"), "0")
            element.set(qn("w:color"), style[1])
        else:
            element.set(qn("w:val"), "nil")
        borders.append(element)


def set_run_font(run, name, size, color, bold=False):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.font.bold = bold
    r_pr = run._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn("w:ascii"), name)
    r_fonts.set(qn("w:hAnsi"), name)


def add_field(paragraph, instruction):
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instruction_node = OxmlElement("w:instrText")
    instruction_node.set(qn("xml:space"), "preserve")
    instruction_node.text = instruction
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    value = OxmlElement("w:t")
    value.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.extend([begin, instruction_node, separate, value, end])
    set_run_font(run, "Arial", 8, INK, bold=True)


def clear_container(container):
    element = container._element
    for child in list(element):
        element.remove(child)


def set_picture_alt_text(inline_shape, title, description):
    doc_pr = inline_shape._inline.docPr
    doc_pr.set("name", title)
    doc_pr.set("title", title)
    doc_pr.set("descr", description)


def build():
    document = Document()
    section = document.sections[0]
    section.page_width = Mm(210)
    section.page_height = Mm(297)
    section.orientation = 0
    section.top_margin = Mm(43)
    section.bottom_margin = Mm(23)
    section.left_margin = Mm(20)
    section.right_margin = Mm(20)
    section.header_distance = Mm(7)
    section.footer_distance = Mm(8)

    core = document.core_properties
    core.title = "Folha timbrada ICosta Advocacia"
    core.subject = "Papel timbrado institucional"
    core.author = "ICosta Advocacia e Consultoria Jurídica"
    core.keywords = "ICosta; papel timbrado; advocacia; consultoria jurídica"

    normal = document.styles["Normal"]
    normal.font.name = "Georgia"
    normal.font.size = Pt(11.5)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Georgia")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Georgia")
    normal.paragraph_format.space_after = Pt(7)
    normal.paragraph_format.line_spacing = 1.15

    header = section.header
    clear_container(header)
    header_table = header.add_table(rows=1, cols=2, width=Mm(170))
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_table.autofit = False
    header_table.columns[0].width = Mm(111)
    header_table.columns[1].width = Mm(59)
    set_table_borders(header_table, bottom=(14, GOLD))

    logo_cell, contact_cell = header_table.rows[0].cells
    for cell in (logo_cell, contact_cell):
        set_cell_shading(cell, GREEN)
        set_cell_margins(cell, top=120, start=190, bottom=120, end=190)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    logo_paragraph = logo_cell.paragraphs[0]
    logo_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    logo_paragraph.paragraph_format.space_after = Pt(0)
    shape = logo_paragraph.add_run().add_picture(str(BRAND / "logo-primary.png"), width=Mm(94))
    set_picture_alt_text(shape, "Logotipo ICosta", "ICosta Advocacia e Consultoria Jurídica")

    contact = contact_cell.paragraphs[0]
    contact.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    contact.paragraph_format.space_after = Pt(0)
    contact.paragraph_format.line_spacing = 1.08
    set_run_font(contact.add_run("icosta.adv.br"), "Arial", 9.2, GOLD, bold=True)
    set_run_font(contact.add_run("\ncontato@icosta.adv.br"), "Arial", 8.1, WARM_WHITE)
    set_run_font(contact.add_run("\nWhatsApp  (12) 98103-9999"), "Arial", 8.1, WARM_WHITE)
    header.add_paragraph().paragraph_format.space_after = Pt(0)

    footer = section.footer
    clear_container(footer)
    footer_table = footer.add_table(rows=1, cols=2, width=Mm(170))
    footer_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    footer_table.autofit = False
    footer_table.columns[0].width = Mm(148)
    footer_table.columns[1].width = Mm(22)
    set_table_borders(footer_table, top=(10, GOLD))

    info_cell, page_cell = footer_table.rows[0].cells
    set_cell_margins(info_cell, top=105, start=0, bottom=0, end=120)
    set_cell_margins(page_cell, top=105, start=80, bottom=0, end=0)
    info_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    page_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    info = info_cell.paragraphs[0]
    info.alignment = WD_ALIGN_PARAGRAPH.LEFT
    info.paragraph_format.space_after = Pt(0)
    info.paragraph_format.line_spacing = 1.05
    set_run_font(
        info.add_run("Avenida Alfredo Ignácio Nogueira Penido, 335, sala 104  •  Jardim Aquarius  •  São José dos Campos/SP  •  CEP 12246-000"),
        "Arial",
        7.2,
        INK,
    )
    set_run_font(
        info.add_run("\n(12) 3922-9758  •  (12) 98103-9999  •  contato@icosta.adv.br"),
        "Arial",
        7.2,
        INK,
    )

    page = page_cell.paragraphs[0]
    page.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    page.paragraph_format.space_after = Pt(0)
    set_run_font(page.add_run("Página "), "Arial", 8, INK)
    add_field(page, "PAGE")

    body = document.add_paragraph()
    body.paragraph_format.space_after = Pt(0)

    document.settings.element.append(OxmlElement("w:updateFields"))
    document.settings.element[-1].set(qn("w:val"), "true")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document.save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    build()
