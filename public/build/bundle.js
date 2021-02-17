
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Components/HeaderComponent.svelte generated by Svelte v3.32.3 */

    const file = "src/Components/HeaderComponent.svelte";

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let h1;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "MeetUs";
    			attr_dev(span, "class", "txt-sink svelte-1bkb4ay");
    			add_location(span, file, 24, 2, 512);
    			attr_dev(h1, "class", "svelte-1bkb4ay");
    			add_location(h1, file, 23, 2, 505);
    			attr_dev(header, "class", "svelte-1bkb4ay");
    			add_location(header, file, 22, 1, 494);
    			attr_dev(div, "class", "container svelte-1bkb4ay");
    			add_location(div, file, 18, 0, 406);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(header, h1);
    			append_dev(h1, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderComponent", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HeaderComponent> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class HeaderComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderComponent",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/MeetUps/MeetUpItems.svelte generated by Svelte v3.32.3 */

    const file$1 = "src/MeetUps/MeetUpItems.svelte";

    function create_fragment$1(ctx) {
    	let article;
    	let header;
    	let h1;
    	let span0;
    	let t0;
    	let t1;
    	let h2;
    	let span1;
    	let t2;
    	let t3;
    	let a0;
    	let span2;
    	let t5;
    	let span3;
    	let t6;
    	let t7;
    	let div0;
    	let img;
    	let img_src_value;
    	let t8;
    	let div1;
    	let p;
    	let t9;
    	let t10;
    	let footer;
    	let a1;
    	let t11;
    	let span4;
    	let t12;
    	let a1_href_value;
    	let t13;
    	let div2;
    	let button0;
    	let span5;
    	let t15;
    	let button1;
    	let span6;

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			h1 = element("h1");
    			span0 = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			span1 = element("span");
    			t2 = text(/*subtitle*/ ctx[1]);
    			t3 = space();
    			a0 = element("a");
    			span2 = element("span");
    			span2.textContent = "Address:";
    			t5 = space();
    			span3 = element("span");
    			t6 = text(/*address*/ ctx[4]);
    			t7 = space();
    			div0 = element("div");
    			img = element("img");
    			t8 = space();
    			div1 = element("div");
    			p = element("p");
    			t9 = text(/*description*/ ctx[3]);
    			t10 = space();
    			footer = element("footer");
    			a1 = element("a");
    			t11 = text("Contact: ");
    			span4 = element("span");
    			t12 = text(/*email*/ ctx[5]);
    			t13 = space();
    			div2 = element("div");
    			button0 = element("button");
    			span5 = element("span");
    			span5.textContent = "Show Details";
    			t15 = space();
    			button1 = element("button");
    			span6 = element("span");
    			span6.textContent = "Favorite";
    			attr_dev(span0, "class", "header svelte-1g5lx56");
    			add_location(span0, file$1, 30, 3, 659);
    			attr_dev(h1, "class", "svelte-1g5lx56");
    			add_location(h1, file$1, 29, 2, 651);
    			attr_dev(span1, "class", "header2 svelte-1g5lx56");
    			add_location(span1, file$1, 33, 3, 713);
    			attr_dev(h2, "class", "svelte-1g5lx56");
    			add_location(h2, file$1, 32, 2, 705);
    			attr_dev(span2, "class", "address svelte-1g5lx56");
    			add_location(span2, file$1, 36, 3, 791);
    			attr_dev(span3, "class", "address2 svelte-1g5lx56");
    			add_location(span3, file$1, 37, 3, 832);
    			attr_dev(a0, "class", "contact-info svelte-1g5lx56");
    			add_location(a0, file$1, 35, 2, 763);
    			attr_dev(header, "class", "svelte-1g5lx56");
    			add_location(header, file$1, 28, 1, 640);
    			if (img.src !== (img_src_value = /*imgURL*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[0]);
    			attr_dev(img, "class", "svelte-1g5lx56");
    			add_location(img, file$1, 45, 2, 993);
    			attr_dev(div0, "class", "image svelte-1g5lx56");
    			add_location(div0, file$1, 43, 1, 934);
    			attr_dev(p, "class", "svelte-1g5lx56");
    			add_location(p, file$1, 51, 2, 1110);
    			attr_dev(div1, "class", "content svelte-1g5lx56");
    			add_location(div1, file$1, 50, 1, 1086);
    			attr_dev(span4, "class", "email svelte-1g5lx56");
    			add_location(span4, file$1, 58, 12, 1264);
    			attr_dev(a1, "href", a1_href_value = "mailto:" + /*email*/ ctx[5]);
    			attr_dev(a1, "class", "contact-info svelte-1g5lx56");
    			add_location(a1, file$1, 57, 2, 1205);
    			attr_dev(span5, "class", " svelte-1g5lx56");
    			add_location(span5, file$1, 62, 3, 1348);
    			attr_dev(button0, "class", "svelte-1g5lx56");
    			add_location(button0, file$1, 61, 2, 1336);
    			attr_dev(span6, "class", "svelte-1g5lx56");
    			add_location(span6, file$1, 65, 3, 1422);
    			attr_dev(button1, "class", "pad2 svelte-1g5lx56");
    			add_location(button1, file$1, 64, 2, 1397);
    			attr_dev(div2, "class", "btn-wrapper svelte-1g5lx56");
    			add_location(div2, file$1, 60, 2, 1308);
    			attr_dev(footer, "class", "svelte-1g5lx56");
    			add_location(footer, file$1, 56, 1, 1194);
    			attr_dev(article, "class", "container svelte-1g5lx56");
    			add_location(article, file$1, 23, 0, 525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, h1);
    			append_dev(h1, span0);
    			append_dev(span0, t0);
    			append_dev(header, t1);
    			append_dev(header, h2);
    			append_dev(h2, span1);
    			append_dev(span1, t2);
    			append_dev(header, t3);
    			append_dev(header, a0);
    			append_dev(a0, span2);
    			append_dev(a0, t5);
    			append_dev(a0, span3);
    			append_dev(span3, t6);
    			append_dev(article, t7);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t8);
    			append_dev(article, div1);
    			append_dev(div1, p);
    			append_dev(p, t9);
    			append_dev(article, t10);
    			append_dev(article, footer);
    			append_dev(footer, a1);
    			append_dev(a1, t11);
    			append_dev(a1, span4);
    			append_dev(span4, t12);
    			append_dev(footer, t13);
    			append_dev(footer, div2);
    			append_dev(div2, button0);
    			append_dev(button0, span5);
    			append_dev(div2, t15);
    			append_dev(div2, button1);
    			append_dev(button1, span6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*subtitle*/ 2) set_data_dev(t2, /*subtitle*/ ctx[1]);
    			if (dirty & /*address*/ 16) set_data_dev(t6, /*address*/ ctx[4]);

    			if (dirty & /*imgURL*/ 4 && img.src !== (img_src_value = /*imgURL*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 1) {
    				attr_dev(img, "alt", /*title*/ ctx[0]);
    			}

    			if (dirty & /*description*/ 8) set_data_dev(t9, /*description*/ ctx[3]);
    			if (dirty & /*email*/ 32) set_data_dev(t12, /*email*/ ctx[5]);

    			if (dirty & /*email*/ 32 && a1_href_value !== (a1_href_value = "mailto:" + /*email*/ ctx[5])) {
    				attr_dev(a1, "href", a1_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MeetUpItems", slots, []);
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { imgURL } = $$props;
    	let { description } = $$props;
    	let { address } = $$props;
    	let { email } = $$props;
    	const writable_props = ["title", "subtitle", "imgURL", "description", "address", "email"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MeetUpItems> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("imgURL" in $$props) $$invalidate(2, imgURL = $$props.imgURL);
    		if ("description" in $$props) $$invalidate(3, description = $$props.description);
    		if ("address" in $$props) $$invalidate(4, address = $$props.address);
    		if ("email" in $$props) $$invalidate(5, email = $$props.email);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		subtitle,
    		imgURL,
    		description,
    		address,
    		email
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("imgURL" in $$props) $$invalidate(2, imgURL = $$props.imgURL);
    		if ("description" in $$props) $$invalidate(3, description = $$props.description);
    		if ("address" in $$props) $$invalidate(4, address = $$props.address);
    		if ("email" in $$props) $$invalidate(5, email = $$props.email);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, subtitle, imgURL, description, address, email];
    }

    class MeetUpItems extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			imgURL: 2,
    			description: 3,
    			address: 4,
    			email: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetUpItems",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[1] === undefined && !("subtitle" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'subtitle'");
    		}

    		if (/*imgURL*/ ctx[2] === undefined && !("imgURL" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'imgURL'");
    		}

    		if (/*description*/ ctx[3] === undefined && !("description" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'description'");
    		}

    		if (/*address*/ ctx[4] === undefined && !("address" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'address'");
    		}

    		if (/*email*/ ctx[5] === undefined && !("email" in props)) {
    			console.warn("<MeetUpItems> was created without expected prop 'email'");
    		}
    	}

    	get title() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgURL() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgURL(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<MeetUpItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<MeetUpItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MeetUps/MeetUpGrid.svelte generated by Svelte v3.32.3 */
    const file$2 = "src/MeetUps/MeetUpGrid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (26:1) {#each meetUps as meetup, i}
    function create_each_block(ctx) {
    	let meetupitems;
    	let current;

    	meetupitems = new MeetUpItems({
    			props: {
    				title: /*meetup*/ ctx[1].title,
    				subtitle: /*meetup*/ ctx[1].subtitle,
    				description: /*meetup*/ ctx[1].description,
    				imgURL: /*meetup*/ ctx[1].imgURL,
    				email: /*meetup*/ ctx[1].contactEmail,
    				address: /*meetup*/ ctx[1].address
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(meetupitems.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(meetupitems, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const meetupitems_changes = {};
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.title = /*meetup*/ ctx[1].title;
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.subtitle = /*meetup*/ ctx[1].subtitle;
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.description = /*meetup*/ ctx[1].description;
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.imgURL = /*meetup*/ ctx[1].imgURL;
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.email = /*meetup*/ ctx[1].contactEmail;
    			if (dirty & /*meetUps*/ 1) meetupitems_changes.address = /*meetup*/ ctx[1].address;
    			meetupitems.$set(meetupitems_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupitems.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupitems.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(meetupitems, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:1) {#each meetUps as meetup, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let current;
    	let each_value = /*meetUps*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "foreach-meetup svelte-1scp20h");
    			add_location(section, file$2, 20, 0, 475);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*meetUps*/ 1) {
    				each_value = /*meetUps*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MeetUpGrid", slots, []);
    	let { meetUps } = $$props;
    	const writable_props = ["meetUps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MeetUpGrid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("meetUps" in $$props) $$invalidate(0, meetUps = $$props.meetUps);
    	};

    	$$self.$capture_state = () => ({ MeetUpItems, meetUps });

    	$$self.$inject_state = $$props => {
    		if ("meetUps" in $$props) $$invalidate(0, meetUps = $$props.meetUps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [meetUps];
    }

    class MeetUpGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { meetUps: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetUpGrid",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*meetUps*/ ctx[0] === undefined && !("meetUps" in props)) {
    			console.warn("<MeetUpGrid> was created without expected prop 'meetUps'");
    		}
    	}

    	get meetUps() {
    		throw new Error("<MeetUpGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meetUps(value) {
    		throw new Error("<MeetUpGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	let div6;
    	let headercomponent;
    	let t0;
    	let main;
    	let form;
    	let div0;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let div1;
    	let label1;
    	let t5;
    	let input1;
    	let t6;
    	let div2;
    	let label2;
    	let t8;
    	let input2;
    	let t9;
    	let div3;
    	let label3;
    	let t11;
    	let input3;
    	let t12;
    	let div4;
    	let label4;
    	let t14;
    	let input4;
    	let t15;
    	let div5;
    	let label5;
    	let t17;
    	let textarea;
    	let t18;
    	let button;
    	let t20;
    	let meetupgrid;
    	let current;
    	let mounted;
    	let dispose;
    	headercomponent = new HeaderComponent({ $$inline: true });

    	meetupgrid = new MeetUpGrid({
    			props: { meetUps: /*meetUps*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			create_component(headercomponent.$$.fragment);
    			t0 = space();
    			main = element("main");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Title";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Subtitle";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Address";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Image URL";
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Email";
    			t14 = space();
    			input4 = element("input");
    			t15 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "Description";
    			t17 = space();
    			textarea = element("textarea");
    			t18 = space();
    			button = element("button");
    			button.textContent = "Save";
    			t20 = space();
    			create_component(meetupgrid.$$.fragment);
    			attr_dev(label0, "for", "title");
    			attr_dev(label0, "class", "svelte-1cdlx12");
    			add_location(label0, file$3, 86, 4, 2155);
    			attr_dev(input0, "id", "title");
    			attr_dev(input0, "placeholder", "Enter Title");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-1cdlx12");
    			add_location(input0, file$3, 87, 4, 2192);
    			attr_dev(div0, "class", "form-control svelte-1cdlx12");
    			add_location(div0, file$3, 85, 3, 2124);
    			attr_dev(label1, "for", "subtitle");
    			attr_dev(label1, "class", "svelte-1cdlx12");
    			add_location(label1, file$3, 97, 4, 2359);
    			attr_dev(input1, "id", "subtitle");
    			attr_dev(input1, "placeholder", "Enter Subtitle");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-1cdlx12");
    			add_location(input1, file$3, 98, 4, 2402);
    			attr_dev(div1, "class", "form-control svelte-1cdlx12");
    			add_location(div1, file$3, 96, 3, 2328);
    			attr_dev(label2, "for", "address");
    			attr_dev(label2, "class", "svelte-1cdlx12");
    			add_location(label2, file$3, 108, 4, 2577);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "address");
    			attr_dev(input2, "placeholder", "Enter Address");
    			attr_dev(input2, "class", "svelte-1cdlx12");
    			add_location(input2, file$3, 109, 4, 2618);
    			attr_dev(div2, "class", "form-control svelte-1cdlx12");
    			add_location(div2, file$3, 107, 3, 2546);
    			attr_dev(label3, "for", "imgURL");
    			attr_dev(label3, "class", "svelte-1cdlx12");
    			add_location(label3, file$3, 119, 4, 2792);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "imgURL");
    			attr_dev(input3, "placeholder", "Enter Image URL");
    			attr_dev(input3, "class", "svelte-1cdlx12");
    			add_location(input3, file$3, 120, 4, 2834);
    			attr_dev(div3, "class", "form-control svelte-1cdlx12");
    			add_location(div3, file$3, 118, 3, 2761);
    			attr_dev(label4, "for", "email");
    			attr_dev(label4, "class", "svelte-1cdlx12");
    			add_location(label4, file$3, 130, 4, 3004);
    			attr_dev(input4, "type", "email");
    			attr_dev(input4, "id", "email");
    			attr_dev(input4, "placeholder", "Enter Email");
    			attr_dev(input4, "class", "svelte-1cdlx12");
    			add_location(input4, file$3, 131, 4, 3041);
    			attr_dev(div4, "class", "form-control svelte-1cdlx12");
    			add_location(div4, file$3, 129, 3, 2973);
    			attr_dev(label5, "for", "description");
    			attr_dev(label5, "class", "svelte-1cdlx12");
    			add_location(label5, file$3, 141, 4, 3212);
    			attr_dev(textarea, "id", "description");
    			attr_dev(textarea, "placeholder", "Enter Description");
    			attr_dev(textarea, "rows", "3");
    			attr_dev(textarea, "class", "svelte-1cdlx12");
    			add_location(textarea, file$3, 142, 4, 3261);
    			attr_dev(div5, "class", "form-control svelte-1cdlx12");
    			add_location(div5, file$3, 140, 3, 3181);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-1cdlx12");
    			add_location(button, file$3, 149, 3, 3395);
    			attr_dev(form, "class", "svelte-1cdlx12");
    			add_location(form, file$3, 82, 2, 2058);
    			attr_dev(main, "class", "svelte-1cdlx12");
    			add_location(main, file$3, 80, 1, 2048);
    			attr_dev(div6, "class", "container svelte-1cdlx12");
    			add_location(div6, file$3, 71, 0, 1837);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			mount_component(headercomponent, div6, null);
    			append_dev(div6, t0);
    			append_dev(div6, main);
    			append_dev(main, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			set_input_value(input0, /*title*/ ctx[0]);
    			append_dev(form, t3);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t5);
    			append_dev(div1, input1);
    			set_input_value(input1, /*subtitle*/ ctx[1]);
    			append_dev(form, t6);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t8);
    			append_dev(div2, input2);
    			set_input_value(input2, /*address*/ ctx[3]);
    			append_dev(form, t9);
    			append_dev(form, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t11);
    			append_dev(div3, input3);
    			set_input_value(input3, /*imgURL*/ ctx[2]);
    			append_dev(form, t12);
    			append_dev(form, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t14);
    			append_dev(div4, input4);
    			set_input_value(input4, /*email*/ ctx[4]);
    			append_dev(form, t15);
    			append_dev(form, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t17);
    			append_dev(div5, textarea);
    			append_dev(form, t18);
    			append_dev(form, button);
    			append_dev(main, t20);
    			mount_component(meetupgrid, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[10]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[11]),
    					listen_dev(form, "submit", prevent_default(/*addMeetUp*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1 && input0.value !== /*title*/ ctx[0]) {
    				set_input_value(input0, /*title*/ ctx[0]);
    			}

    			if (dirty & /*subtitle*/ 2 && input1.value !== /*subtitle*/ ctx[1]) {
    				set_input_value(input1, /*subtitle*/ ctx[1]);
    			}

    			if (dirty & /*address*/ 8 && input2.value !== /*address*/ ctx[3]) {
    				set_input_value(input2, /*address*/ ctx[3]);
    			}

    			if (dirty & /*imgURL*/ 4 && input3.value !== /*imgURL*/ ctx[2]) {
    				set_input_value(input3, /*imgURL*/ ctx[2]);
    			}

    			if (dirty & /*email*/ 16 && input4.value !== /*email*/ ctx[4]) {
    				set_input_value(input4, /*email*/ ctx[4]);
    			}

    			const meetupgrid_changes = {};
    			if (dirty & /*meetUps*/ 32) meetupgrid_changes.meetUps = /*meetUps*/ ctx[5];
    			meetupgrid.$set(meetupgrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headercomponent.$$.fragment, local);
    			transition_in(meetupgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headercomponent.$$.fragment, local);
    			transition_out(meetupgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(headercomponent);
    			destroy_component(meetupgrid);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	/**: - ©MEMBER-PROPERTIES| */
    	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/
    	let title = "";

    	let subtitle = "";
    	let description = "";
    	let imgURL = "";
    	let address = "";
    	let email = "";

    	//___________
    	let meetUps = [
    		//___________
    		{
    			id: "m1",
    			title: "Coding Bootcamp",
    			subtitle: "Learn to code in 2 hours",
    			description: "In this meetup we will have experts," + " that will teach you how to code!",
    			imgURL: "https://images.pexels.com/photos/220887/" + "pexels-photo-220887.jpeg?auto=compress&cs" + "=tinysrgb&dpr=2&w=500",
    			address: "Apple st 127, L1 8JQ London England",
    			contactEmail: "codeHardCore@test.com"
    		},
    		{
    			id: "m2",
    			title: "Swim Together",
    			subtitle: "Let's go for swimming lessons",
    			description: "We will swim & enjoy the weather",
    			imgURL: "https://images.pexels.com/photos/462024/" + "pexels-photo-462024.jpeg?auto=compress&cs=" + "tinysrgb&dpr=2&w=500",
    			address: "Calle Del Mal, Republica Dominicana",
    			contactEmail: "codeHardCore@test.com"
    		}
    	]; //___________

    	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/
    	/**| ™- LABELED-STATEMENT |*/
    	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    	/** #™━━━━━━━━━━━━━━━━━━━ FUNCTION ━━━━━━━━━━━━━━━━━━━ */
    	const addMeetUp = () => {
    		//___________
    		/** Object literal */
    		const newMeetUp = {
    			id: (Math.random() * Date.now()).toString(),
    			title,
    			subtitle,
    			description,
    			imgURL,
    			address,
    			contactEmail: email
    		};

    		$$invalidate(5, meetUps = [newMeetUp, ...meetUps]);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		title = this.value;
    		$$invalidate(0, title);
    	}

    	function input1_input_handler() {
    		subtitle = this.value;
    		$$invalidate(1, subtitle);
    	}

    	function input2_input_handler() {
    		address = this.value;
    		$$invalidate(3, address);
    	}

    	function input3_input_handler() {
    		imgURL = this.value;
    		$$invalidate(2, imgURL);
    	}

    	function input4_input_handler() {
    		email = this.value;
    		$$invalidate(4, email);
    	}

    	$$self.$capture_state = () => ({
    		HeaderComponent,
    		MeetUpGrid,
    		title,
    		subtitle,
    		description,
    		imgURL,
    		address,
    		email,
    		meetUps,
    		addMeetUp
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("description" in $$props) description = $$props.description;
    		if ("imgURL" in $$props) $$invalidate(2, imgURL = $$props.imgURL);
    		if ("address" in $$props) $$invalidate(3, address = $$props.address);
    		if ("email" in $$props) $$invalidate(4, email = $$props.email);
    		if ("meetUps" in $$props) $$invalidate(5, meetUps = $$props.meetUps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		subtitle,
    		imgURL,
    		address,
    		email,
    		meetUps,
    		addMeetUp,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
