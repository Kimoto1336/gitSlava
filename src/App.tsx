import {useEffect, useState} from 'react';
import {Link, NavLink, Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {
    BookOpen,
    Compass,
    Search,
    Bookmark,
    ChartNoAxesColumn,
    Menu,
    Plus,
    ArrowUpRight,
    ChevronRight,
    SlidersHorizontal,
    Download,
    Upload,
    Sun,
    ScrollText,
    Map,
    Users,
    CalendarDays,
    Info,
    Heart,
    ArrowLeft,
    ExternalLink,
    LibraryBig
} from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from './store';
import {add, update, remove, toggleFavorite} from './store';
import {entries} from './mocks/data';
import type {Entry} from './mocks/data';

const nav = [['/', 'Обзор', Compass], ['/encyclopedia', 'Энциклопедия', BookOpen], ['/deities', 'Божества', Sun], ['/spirits', 'Духи', Users], ['/rituals', 'Обряды', ScrollText], ['/regions', 'Регионы', Map], ['/favorites', 'Избранное', Bookmark], ['/statistics', 'Статистика', ChartNoAxesColumn]];

function Shell({children}: { children: React.ReactNode }) {
    return (
        <div className="app">
            <main className="main">
                <div className="content">{children}</div>
            </main>
        </div>
    );
}

function Heading({eyebrow, title, desc}: { eyebrow: string; title: string; desc: string }) {
    return <div className="page-heading">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1><p>{desc}</p></div>
}

function Card({item}: { item: Entry }) {
    const fav = useSelector((s: RootState) => s.library.favorites.includes(item.id));
    const dispatch = useDispatch<AppDispatch>();
    return <article className="entry-card">
        <div className="entry-top"><span className="symbol">{item.symbol}</span>
            <button className={'heart ' + (fav ? 'liked' : '')} title="В избранное"
                    onClick={() => dispatch(toggleFavorite(item.id))}><Heart size={17}
                                                                             fill={fav ? 'currentColor' : 'none'}/>
            </button>
        </div>
        <div className="entry-cat">{item.category} · {item.region}</div>
        <Link to={'/article/' + item.id} className="entry-title">{item.title}<ArrowUpRight size={15}/></Link>
        <p>{item.description}</p>
        <div className="entry-foot"><span className="status"><i
            className={item.status === 'Изучено' ? 'green' : item.status === 'Черновик' ? 'amber' : ''}></i>{item.status}</span><span>{item.amount} заметок</span>
        </div>
    </article>
}

function Home() {
    const [items, setItems] = useState<Entry[]>([]), [loading, setLoading] = useState(true);
    const all = useSelector((s: RootState) => s.library.items);
    useEffect(() => {
        const t = setTimeout(() => {
            setItems(all);
            setLoading(false)
        }, 350);
        return () => clearTimeout(t)
    }, [all]);
    return <>
        <section className="hero">
            <div className="hero-copy">
                <div className="eyebrow light">АТЛАС НАРОДНОЙ ПАМЯТИ <span>✳</span></div>
                <h1>Мир, сотканный<br/>из <em>преданий.</em></h1><p>Путеводитель по славянским мифологиям: божества,
                духи, обряды и образы, сохранившиеся в народной памяти.</p>
                <div className="hero-buttons"><Link to="/encyclopedia" className="light-button">Исследовать
                    энциклопедию <ArrowUpRight size={16}/></Link><Link to="/about" className="hero-link">О
                    проекте <ChevronRight size={15}/></Link></div>
            </div>
            <div className="hero-art">
                <div className="sun-disc"></div>
                <div className="rune rune-a">✳</div>
                <div className="rune rune-b">ᛉ</div>
                <div className="hero-caption">СЛАВЯНСКОЕ<br/>МИРОВОЗЗРЕНИЕ <span>01 / 04</span></div>
            </div>
            <div className="hero-index">01 <span>—</span> 04</div>
        </section>
        <section className="stats-strip">
            <div><span>01 / КОЛЛЕКЦИЯ</span><b>{all.length.toString().padStart(2, '0')} <small>статей</small></b></div>
            <div><span>02 / РАЗДЕЛЫ</span><b>06 <small>направлений</small></b></div>
            <div>
                <span>03 / ИЗУЧЕНО</span><b>{all.filter(x => x.status === 'Изучено').length.toString().padStart(2, '0')}
                <small>материалов</small></b></div>
            <div className="strip-quote">«У каждого края — свой рассказ»</div>
        </section>
        <section className="section">
            <div className="section-head">
                <div>
                    <div className="eyebrow">НАЧНИТЕ ПУТЕШЕСТВИЕ</div>
                    <h2>Откройте для себя</h2></div>
                <Link className="text-link" to="/encyclopedia">Все статьи <ArrowUpRight size={15}/></Link></div>
            <div className="entry-grid">{loading ? <p>Загрузка...</p> : items.slice(0, 3).map(x => <Card key={x.id}
                                                                                                         item={x}/>)}</div>
        </section>
        <section className="explore">
            <div>
                <div className="eyebrow">ПУТЬ ИССЛЕДОВАТЕЛЯ</div>
                <h2>У каждой истории<br/>есть своё место.</h2><p>Выберите направление, чтобы начать знакомство с
                многообразием славянских традиций.</p></div>
            <div className="explore-links"><Link to="/deities"><span>✺</span><b>Божества</b><small>Персонажи
                пантеонов</small><ArrowUpRight/></Link><Link to="/spirits"><span>♧</span><b>Духи и существа</b><small>Хранители
                и обитатели миров</small><ArrowUpRight/></Link><Link to="/rituals"><span>☼</span><b>Обряды</b><small>Календарь
                и традиции</small><ArrowUpRight/></Link></div>
        </section>
    </>
}

function Listing({category, title, desc}: { category?: string; title: string; desc: string }) {
    const items = useSelector((s: RootState) => s.library.items);
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('name');
    const filtered = items.filter(x => (!category || x.category === category) && (`${x.title} ${x.description} ${x.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => sort === 'name' ? a.title.localeCompare(b.title, 'ru') : b.amount - a.amount);
    return <><Heading eyebrow="КАТАЛОГ ЗНАНИЙ" title={title} desc={desc}/>
        <div className="filterbar"><label className="searchbox"><Search size={17}/><input value={q}
                                                                                          onChange={e => setQ(e.target.value)}
                                                                                          placeholder="Найти в каталоге..."/></label><label
            className="sortbox"><SlidersHorizontal size={16}/><select value={sort}
                                                                      onChange={e => setSort(e.target.value)}>
            <option value="name">По названию</option>
            <option value="amount">По заметкам</option>
        </select></label><span className="result-count">{filtered.length} материала</span></div>
        {filtered.length ? <div className="entry-grid">{filtered.map(x => <Card key={x.id} item={x}/>)}</div> :
            <div className="empty"><Search/><h3>Ничего не найдено</h3><p>Попробуйте изменить поисковый запрос.</p>
            </div>}</>
}

function Article() {
    const {id} = useParams();
    const item = useSelector((s: RootState) => s.library.items.find(x => x.id === id));
    const dispatch = useDispatch<AppDispatch>();
    const navg = useNavigate();
    if (!item) return <div className="empty"><h2>Статья не найдена</h2><Link to="/encyclopedia">Вернуться в
        каталог</Link></div>;
    return <>
        <div className="backline"><Link to="/encyclopedia"><ArrowLeft
            size={15}/> Энциклопедия</Link><span> / {item.category}</span></div>
        <div className="article-layout">
            <article className="article">
                <div className="eyebrow">ЭНЦИКЛОПЕДИЯ · {item.category.toUpperCase()}</div>
                <div className="article-title-row"><h1>{item.title}</h1>
                    <button className="outline-button" onClick={() => dispatch(toggleFavorite(item.id))}><Heart
                        size={16}
                        fill={useSelector((s: RootState) => s.library.favorites.includes(item.id)) ? 'currentColor' : 'none'}/> Сохранить
                    </button>
                </div>
                <p className="lead">{item.description}</p>
                <div className="article-rule"></div>
                <h2>Образ и традиция</h2><p>{item.description} Представления о персонаже формировались в разных
                местностях и менялись со временем. Поэтому отдельные детали следует рассматривать в контексте
                конкретного источника, а не как единый канон.</p><h2>В культурном контексте</h2><p>Фольклорные образы
                отражают отношения человека с природой, сообществом и неизвестным. Устная традиция допускает множество
                локальных вариантов и не всегда позволяет восстановить единую первоначальную картину.</p>
                <div className="tag-list">{item.tags.map(t => <span key={t}>#{t}</span>)}</div>
            </article>
            <aside className="info-card">
                <div className="info-symbol">{item.symbol}</div>
                <div className="info-title">Краткая справка</div>
                <dl>
                    <dt>Раздел</dt>
                    <dd>{item.category}</dd>
                    <dt>Традиция</dt>
                    <dd>{item.region}</dd>
                    <dt>Статус заметки</dt>
                    <dd>{item.status}</dd>
                    <dt>Дата обновления</dt>
                    <dd>{item.date}</dd>
                    <dt>Связанные заметки</dt>
                    <dd>{item.amount}</dd>
                </dl>
                <Link className="edit-link" to={'/edit/' + item.id}>Редактировать статью <ArrowUpRight
                    size={14}/></Link>
                <button className="delete-link" onClick={() => {
                    if (confirm('Удалить статью?')) {
                        dispatch(remove(item.id));
                        navg('/encyclopedia')
                    }
                }}>Удалить статью
                </button>
            </aside>
        </div>
    </>
}

function Editor({edit = false}: { edit?: boolean }) {
    const {id} = useParams();
    const old = useSelector((s: RootState) => s.library.items.find(x => x.id === id));
    const dispatch = useDispatch<AppDispatch>();
    const navg = useNavigate();
    const [title, setTitle] = useState(old?.title || '');
    const [description, setDescription] = useState(old?.description || '');
    const [category, setCategory] = useState(old?.category || 'Божества');
    const [region, setRegion] = useState(old?.region || 'Восточные славяне');
    const [status, setStatus] = useState(old?.status || 'Черновик');
    const [amount, setAmount] = useState(old?.amount || 0);
    const [error, setError] = useState('');
    return <><Heading eyebrow="РАБОТА С МАТЕРИАЛАМИ" title={edit ? 'Редактирование статьи' : 'Новая статья'}
                      desc="Добавьте материал в библиотеку и сохраните его в локальной коллекции."/>
        <form className="editor" onSubmit={e => {
            e.preventDefault();
            if (!title.trim() || !description.trim()) {
                setError('Заполните название и описание.');
                return
            }
            const x: Entry = {
                id: old?.id || 'article-' + Date.now(),
                title: title.trim(),
                description,
                category,
                status,
                amount: Number(amount),
                date: new Date().toISOString().slice(0, 10),
                isActive: true,
                region,
                symbol: old?.symbol || '✳',
                tags: old?.tags || ['новая заметка']
            };
            dispatch(edit ? update(x) : add(x));
            navg('/article/' + x.id)
        }}><label>Название<input value={title} onChange={e => setTitle(e.target.value)}
                                 placeholder="Например, Сварожич"/></label><label>Описание<textarea rows={5}
                                                                                                    value={description}
                                                                                                    onChange={e => setDescription(e.target.value)}
                                                                                                    placeholder="Краткое описание материала..."/></label>
            <div className="form-row"><label>Категория<select value={category}
                                                              onChange={e => setCategory(e.target.value)}>{['Божества', 'Духи', 'Обряды', 'Понятия', 'Сказочные персонажи'].map(x =>
                <option>{x}</option>)}</select></label><label>Традиция<input value={region}
                                                                             onChange={e => setRegion(e.target.value)}/></label>
            </div>
            <div className="form-row"><label>Статус<select value={status}
                                                           onChange={e => setStatus(e.target.value)}>{['Черновик', 'К чтению', 'Изучено'].map(x =>
                <option>{x}</option>)}</select></label><label>Количество заметок<input type="number" min="0"
                                                                                       value={amount}
                                                                                       onChange={e => setAmount(+e.target.value)}/></label>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="form-actions"><Link to="/encyclopedia" className="cancel">Отмена</Link>
                <button className="add-button" type="submit">Сохранить статью <ArrowUpRight size={15}/></button>
            </div>
        </form>
    </>
}

function SearchPage() {
    const [q, setQ] = useState('');
    const items = useSelector((s: RootState) => s.library.items);
    const results = items.filter(x => (x.title + ' ' + x.description + ' ' + x.tags.join(' ')).toLowerCase().includes(q.toLowerCase()) && q.trim());
    return <><Heading eyebrow="ПОИСК ПО БИБЛИОТЕКЕ" title="Найти историю"
                      desc="Ищите по названиям, описаниям и ключевым словам."/><label
        className="searchbox big-search"><Search/><input autoFocus value={q} onChange={e => setQ(e.target.value)}
                                                         placeholder="Например, лес, гром, обряд..."/></label>{q && <><p
        className="result-count">{results.length} результатов</p>
        <div className="entry-grid">{results.map(x => <Card key={x.id} item={x}/>)}</div>
    </>}</>
}

function Simple({type}: { type: string }) {
    const items = useSelector((s: RootState) => s.library.items);
    const dispatch = useDispatch<AppDispatch>();
    if (type === 'favorites') {
        const fav = useSelector((s: RootState) => s.library.favorites);
        return <><Heading eyebrow="ВАША КОЛЛЕКЦИЯ" title="Избранное" desc="Статьи, к которым вы хотите вернуться."/>
            <div className="entry-grid">{items.filter(x => fav.includes(x.id)).map(x => <Card key={x.id}
                                                                                              item={x}/>)}</div>
            {!fav.length &&
                <div className="empty"><Bookmark/><h3>Пока здесь пусто</h3><p>Нажмите на сердечко в карточке статьи,
                    чтобы сохранить её.</p><Link to="/encyclopedia">Перейти в энциклопедию</Link></div>}</>
    }
    if (type === 'statistics') return <><Heading eyebrow="БИБЛИОТЕКА В ЧИСЛАХ" title="Статистика"
                                                 desc="Сводка по материалам, собранным в энциклопедии."/>
        <div className="metric-grid">
            <div><span>Всего статей</span><b>{items.length}</b></div>
            <div><span>Изучено</span><b>{items.filter(x => x.status === 'Изучено').length}</b></div>
            <div><span>К чтению</span><b>{items.filter(x => x.status === 'К чтению').length}</b></div>
            <div><span>Черновики</span><b>{items.filter(x => x.status === 'Черновик').length}</b></div>
        </div>
        <h2 className="subheading">Распределение по
            разделам</h2>{['Божества', 'Духи', 'Обряды', 'Понятия', 'Сказочные персонажи'].map(c => <div
            className="bar-row"><span>{c}</span>
            <div className="bar"><i
                style={{width: (items.filter(x => x.category === c).length / Math.max(items.length, 1) * 100) + '%'}}/>
            </div>
            <b>{items.filter(x => x.category === c).length}</b></div>)}
        <button className="outline-button" onClick={() => {
            const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'slavic-library.json';
            a.click();
            URL.revokeObjectURL(a.href)
        }}><Download size={16}/> Экспорт JSON
        </button>
    </>;
    if (type === 'regions') return <><Heading eyebrow="ГЕОГРАФИЯ ПРЕДАНИЙ" title="Регионы и традиции"
                                              desc="Славянский фольклор не был единым: локальные традиции сохраняют собственные особенности."/>
        <div
            className="feature-grid">{['Восточные славяне', 'Западные славяне', 'Южные славяне', 'Разные традиции'].map((x, i) =>
            <Link to={'/encyclopedia'} className="feature-card"><span>0{i + 1} / РЕГИОН</span><h2>{x}</h2>
                <p>{i === 0 ? 'Русские, украинские и белорусские фольклорные материалы.' : 'Локальные источники, обряды и мифологические образы.'}<ArrowUpRight
                    size={16}/></p></Link>)}</div>
    </>;
    if (type === 'about') return <><Heading eyebrow="О ПРОЕКТЕ" title="Смотреть бережно"
                                            desc="Славянский круг — учебный энциклопедический проект о мифологических образах и фольклорных традициях."/>
        <div className="prose"><h2>Зачем этот гид</h2><p>Проект помогает ориентироваться в разнообразии славянских
            мифологий и народных представлений. Он объединяет статьи о персонажах, обрядах, понятиях и региональных
            особенностях.</p><h2>Как читать материалы</h2><p>Мифологические представления неоднородны. Важно различать
            письменные свидетельства, поздние фольклорные записи и современные реконструкции. Краткие статьи здесь —
            отправная точка для дальнейшего изучения.</p><p className="source-note">Материалы носят обзорный учебный
            характер и не заменяют академические публикации.</p></div>
    </>;
    if (type === 'rituals') return <Listing title="Обряды и календарь"
                                            desc="Календарные практики, обычаи и обрядовые комплексы."
                                            category="Обряды"/>;
    return <Listing title="Энциклопедия"
                    desc="Алфавитный каталог образов, персонажей и понятий славянского фольклора."/>
}

function ImportPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState('');
    return <><Heading eyebrow="ИНСТРУМЕНТЫ" title="Импорт данных"
                      desc="Загрузите JSON-файл с коллекцией статей. Импорт добавит записи в текущую библиотеку."/>
        <div className="import-box"><Upload size={28}/><h2>Загрузить JSON</h2><p>Ожидается массив объектов статей с
            полями id, title, description, category и другими.</p><input type="file" accept=".json,application/json"
                                                                         onChange={e => {
                                                                             const f = e.target.files?.[0];
                                                                             if (!f) return;
                                                                             f.text().then(t => {
                                                                                 try {
                                                                                     const data = JSON.parse(t);
                                                                                     if (!Array.isArray(data)) throw Error();
                                                                                     data.forEach(x => dispatch(add({
                                                                                         ...x,
                                                                                         id: String(x.id || 'import-' + Date.now() + Math.random()),
                                                                                         title: String(x.title || 'Без названия'),
                                                                                         description: String(x.description || ''),
                                                                                         category: String(x.category || 'Понятия'),
                                                                                         status: String(x.status || 'Черновик'),
                                                                                         amount: Number(x.amount || 0),
                                                                                         date: String(x.date || new Date().toISOString().slice(0, 10)),
                                                                                         isActive: Boolean(x.isActive),
                                                                                         region: String(x.region || 'Не указано'),
                                                                                         symbol: String(x.symbol || '✳'),
                                                                                         tags: Array.isArray(x.tags) ? x.tags : []
                                                                                     })));
                                                                                     setMessage('Импортировано записей: ' + data.length)
                                                                                 } catch {
                                                                                     setMessage('Не удалось прочитать файл. Проверьте формат JSON.')
                                                                                 }
                                                                             })
                                                                         }}/>{message &&
            <p className="import-message">{message}</p>}</div>
    </>
}

export default function App() {
    return (
        <Shell>
            <Home />
        </Shell>
    );
}